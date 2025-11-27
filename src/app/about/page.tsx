import HeroSection from "@/components/layout/common/HeroSection";
import Story from "@/components/layout/About/story";
import Values from "@/components/layout/About/values";
import Mission from "@/components/layout/About/mission";
import Vision from "@/components/layout/About/vision";
import Verification from "@/components/layout/About/verification";
import KeyPillars from "@/components/layout/About/keyPillars";


export default function AboutPage() {
return (
<div className="scroll-smooth">
    <HeroSection   imgUrl="/m.png"
            title="Our Store"
            subTitle="EcoSphere is your trusted destination for eco-friendly products, sustainable gifts, and smart green choices. Browse a variety of earth-conscious items made to help you live cleaner, better, and more naturally every day."
          />
<Story />
<Values />
<Mission />
<Vision />
<Verification />
<KeyPillars />
</div>
);
}