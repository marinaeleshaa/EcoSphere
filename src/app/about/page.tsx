import Story from "@/components/layout/About/story";
import Values from "@/components/layout/About/values";
import Mission from "@/components/layout/About/mission";
import Vision from "@/components/layout/About/vision";
import Standard from "@/components/layout/About/standard";
import KeyPillars from "@/components/layout/About/keyPillars";


export default function AboutPage() {
return (
<div className="scroll-smooth">
<Story />
<Values />
<Mission />
<Vision />
<Standard />
<KeyPillars />
</div>
);
}