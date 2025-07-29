import SectionAboutUsDelivery from "../components/SectionAboutUsDelivery";
import SectionAboutUsTeam from "../components/SectionAboutUsTeam";
import SectionAboutUsTop from "../components/SectionAboutUsTop";
import SectionAboutUsTrusted from "../components/SectionAboutUsTrusted";
import SectionUnderTop from "../components/SectionUnderTop";


const AboutUs = () => {
    return(
        <main className="main">
            <SectionUnderTop subtext="About Us"/>
            <SectionAboutUsTop/>
            <SectionAboutUsTrusted/>
            <SectionAboutUsDelivery/>
            <SectionAboutUsTeam/>
        </main>
    )
}

export default AboutUs;