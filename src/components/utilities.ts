export const toTimeString = ( durationSeconds: number ): string => {
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor(( durationSeconds % 3600 ) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(durationSeconds % 60).toString().padStart(2, '0');

    if ( hours > 0 ) {
        return `${hours}:${minutes}:${seconds}`;
    } else {
        return `${minutes}:${seconds}`;
    }
};

export type SegmentType = 'bookEnd' | 'run' | 'walk';

export const segmentColours: Readonly<Record<SegmentType, string>> = {
    run: '#ff0000',
    bookEnd: '#00fc47',
    walk: '#00bfff',
};

export const segmentTextColours: Readonly<Record<SegmentType, string>> = {
    run: '#ffffff',
    bookEnd: '#000000',
    walk: '#ffffff',
};