import HeroSection from '../common/HeroSection'
import WhyEcosphere from './WhyEcosphere'
import MainDisplayEvents from './MainDisplayEvents'
import { EventProps } from '@/types/EventTypes'
import { useTranslations } from 'next-intl'

export default function EventClient({ events }: Readonly<EventProps>) {
    const t = useTranslations("Events.hero");
    return (
        <>
            <HeroSection
                imgUrl="/events/hero.png"
                title={t("title")}
                subTitle={t("subTitle")}
            />
            <div className="min-h-screen py-8 w-[80%] mx-auto flex flex-col gap-6">
                <WhyEcosphere />
                <MainDisplayEvents events={events} />
            </div>
        </>
    )
}
