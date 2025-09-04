export interface AnimationFrame {
    image: number,
    time: number,
}

export const animationDuration = (animation: Array<AnimationFrame>): number => {
    let time = 0;

    for (const frame of animation) {
        time += frame.time;
    }

    return time;
}

export const getFrameImage = (animation: Array<AnimationFrame>, animationTime: number): number => {
    let time = 0;

    const duratuion = animationDuration(animation);
    animationTime %= duratuion;

    for (let i = 0; i < animation.length; i++) {
        const frame = animation[i];
        time += frame.time;

        if (animationTime <= time) {
            return frame.image;
        }
    }

    return 0;
}

export const isAnimationFinished = (animation: Array<AnimationFrame>, animationTime: number): boolean => {
    const duratuion = animationDuration(animation);
    return animationTime >= duratuion;
}
