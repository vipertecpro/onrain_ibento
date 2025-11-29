import Lottie from "react-lottie-player";
import bad_cat from "../../lotties/bad_cat.json";
import SdAppLayout from '@/layouts/subDomain/sd-app-layout';
export default function ExhibitionNotActive() {
    return (
        <SdAppLayout title={'Exhibition is on hold'}>
            <Lottie loop play animationData={bad_cat} className="mx-auto w-4/5" />
            <h1 className="my-2 text-center text-2xl font-bold text-stone-800 dark:text-white">Exhibition is on hold.</h1>
            <h1 className="my-2 text-center text-xl font-bold text-stone-800 dark:text-white">We will right back soon.</h1>
            <h1 className="my-2 text-center text-xl font-bold text-stone-800 dark:text-white">Please revisit after sometime.</h1>
        </SdAppLayout>
    );
}
