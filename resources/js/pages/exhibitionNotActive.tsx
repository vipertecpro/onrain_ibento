import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function ExhibitionNotActive() {
    return (
        <>
            <DotLottieReact
                width={500}
                height={600}
                className={'w-4/5 mx-auto'}
                src="/lotties/bad_cat.lottie"
                loop
                autoplay
            />
            <h1 className="text-center text-2xl font-bold my-2 text-stone-800 dark:text-white">Exhibition is on hold.</h1>
            <h1 className="text-center text-xl font-bold my-2 text-stone-800 dark:text-white">We will right back soon.</h1>
            <h1 className="text-center text-xl font-bold my-2 text-stone-800 dark:text-white">Please revisit after sometime.</h1>
        </>
    );
}
