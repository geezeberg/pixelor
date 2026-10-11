import type { LogicalPixelGrid } from '../logical-grid/logical-pixel-grid';
import { WorkspaceError } from '../../shared/types/errors';
import { PALETTE_LIMITS } from '../../shared/utils/palette-constants';
import { createPalette } from './palette';
import { createPaletteColorEntry } from './palette-color-entry';

interface ColorSample {
  red: number;
  green: number;
  blue: number;
  hex: string;
  count: number;
}

interface QuantizedColor {
  hex: string;
  count: number;
}

interface ColorBucket {
  colors: ColorSample[];
  totalCount: number;
  minRed: number;
  maxRed: number;
  minGreen: number;
  maxGreen: number;
  minBlue: number;
  maxBlue: number;
}

function toHex(red: number, green: number, blue: number) {
  return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`.toUpperCase();
}

function compareByRgb(left: ColorSample, right: ColorSample) {
  if (left.red !== right.red) {
    return left.red - right.red;
  }

  if (left.green !== right.green) {
    return left.green - right.green;
  }

  return left.blue - right.blue;
}

function collectColorSamples(grid: LogicalPixelGrid): ColorSample[] {
  const counts = new Map<string, number>();

  for (let index = 0; index < grid.sampledPixels.length; index += 4) {
    const alpha = grid.sampledPixels[index + 3];
    if (alpha === 0) {
      continue;
    }

    const hex = toHex(grid.sampledPixels[index], grid.sampledPixels[index + 1], grid.sampledPixels[index + 2]);
    counts.set(hex, (counts.get(hex) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([hex, count]) => ({
      hex,
      red: Number.parseInt(hex.slice(1, 3), 16),
      green: Number.parseInt(hex.slice(3, 5), 16),
      blue: Number.parseInt(hex.slice(5, 7), 16),
      count,
    }))
    .sort(compareByRgb);
}

function createBucket(colors: ColorSample[]): ColorBucket {
  let totalCount = 0;
  let minRed = 255;
  let maxRed = 0;
  let minGreen = 255;
  let maxGreen = 0;
  let minBlue = 255;
  let maxBlue = 0;

  for (const color of colors) {
    totalCount += color.count;
    minRed = Math.min(minRed, color.red);
    maxRed = Math.max(maxRed, color.red);
    minGreen = Math.min(minGreen, color.green);
    maxGreen = Math.max(maxGreen, color.green);
    minBlue = Math.min(minBlue, color.blue);
    maxBlue = Math.max(maxBlue, color.blue);
  }

  return {
    colors,
    totalCount,
    minRed,
    maxRed,
    minGreen,
    maxGreen,
    minBlue,
    maxBlue,
  };
}

function chooseSplitChannel(bucket: ColorBucket): 'red' | 'green' | 'blue' {
  const redRange = bucket.maxRed - bucket.minRed;
  const greenRange = bucket.maxGreen - bucket.minGreen;
  const blueRange = bucket.maxBlue - bucket.minBlue;

  if (redRange >= greenRange && redRange >= blueRange) {
    return 'red';
  }

  if (greenRange >= redRange && greenRange >= blueRange) {
    return 'green';
  }

  return 'blue';
}

function splitBucket(bucket: ColorBucket): [ColorBucket, ColorBucket] | null {
  if (bucket.colors.length < 2) {
    return null;
  }

  const channel = chooseSplitChannel(bucket);
  const sorted = [...bucket.colors].sort((left, right) => {
    const channelDelta = left[channel] - right[channel];
    if (channelDelta !== 0) {
      return channelDelta;
    }

    return compareByRgb(left, right);
  });

  const halfCount = bucket.totalCount / 2;
  let running = 0;
  let splitIndex = 1;

  for (let index = 0; index < sorted.length; index += 1) {
    running += sorted[index].count;
    splitIndex = index + 1;
    if (running >= halfCount) {
      break;
    }
  }

  if (splitIndex <= 0 || splitIndex >= sorted.length) {
    splitIndex = Math.floor(sorted.length / 2);
  }

  if (splitIndex <= 0 || splitIndex >= sorted.length) {
    return null;
  }

  return [createBucket(sorted.slice(0, splitIndex)), createBucket(sorted.slice(splitIndex))];
}

function representativeColor(bucket: ColorBucket): QuantizedColor {
  let weightedRed = 0;
  let weightedGreen = 0;
  let weightedBlue = 0;

  for (const color of bucket.colors) {
    weightedRed += color.red * color.count;
    weightedGreen += color.green * color.count;
    weightedBlue += color.blue * color.count;
  }

  const red = Math.round(weightedRed / bucket.totalCount);
  const green = Math.round(weightedGreen / bucket.totalCount);
  const blue = Math.round(weightedBlue / bucket.totalCount);

  return {
    hex: toHex(red, green, blue),
    count: bucket.totalCount,
  };
}

function quantizeColors(samples: ColorSample[], targetSize: number): QuantizedColor[] {
  const buckets: ColorBucket[] = [createBucket(samples)];

  while (buckets.length < targetSize) {
    let splitCandidateIndex = -1;
    let splitCandidateRange = -1;

    for (let index = 0; index < buckets.length; index += 1) {
      const bucket = buckets[index];
      if (bucket.colors.length < 2) {
        continue;
      }

      const range = Math.max(bucket.maxRed - bucket.minRed, bucket.maxGreen - bucket.minGreen, bucket.maxBlue - bucket.minBlue);
      if (range > splitCandidateRange) {
        splitCandidateRange = range;
        splitCandidateIndex = index;
      }
    }

    if (splitCandidateIndex < 0) {
      break;
    }

    const candidate = buckets[splitCandidateIndex];
    const split = splitBucket(candidate);
    if (!split) {
      break;
    }

    buckets.splice(splitCandidateIndex, 1, split[0], split[1]);
  }

  return buckets
    .map(representativeColor)
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.hex.localeCompare(right.hex);
    })
    .slice(0, targetSize);
}

export function generatePaletteFromGrid(logicalGrid: LogicalPixelGrid, targetSize: number, name = 'Auto Palette') {
  if (!Number.isInteger(targetSize) || targetSize < PALETTE_LIMITS.minColors || targetSize > PALETTE_LIMITS.maxColors) {
    throw new WorkspaceError('palette-generation-failed', 'Requested palette size must be between 2 and 256 colors.', {
      targetSize,
    });
  }

  const sampledColors = collectColorSamples(logicalGrid);

  if (sampledColors.length === 0) {
    throw new WorkspaceError('palette-generation-failed', 'A palette cannot be generated from an empty or fully transparent logical grid.');
  }

  const quantized = quantizeColors(sampledColors, Math.min(targetSize, sampledColors.length));

  if (quantized.length < PALETTE_LIMITS.minColors) {
    quantized.push({ ...quantized[0] });
  }

  const paletteId = `auto-${logicalGrid.gridId}-${targetSize}`;
  const colors = quantized.map((entry, index) =>
    createPaletteColorEntry({
      entryId: `${paletteId}-${index}`,
      hex: entry.hex,
      index,
    }),
  );

  return createPalette({
    paletteId,
    name,
    sourceType: 'automatic',
    colors,
    isEditable: true,
  });
}
