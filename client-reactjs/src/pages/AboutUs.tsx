import SectionAboutUsTop from "../components/SectionAboutUsTop";
import SectionAboutUsTrusted from "../components/SectionAboutUsTrusted";
import SectionUnderTop from "../components/SectionUnderTop";


const AboutUs = () => {
    return(
        <main className="main">
            <SectionUnderTop subtext="About Us"/>
            <SectionAboutUsTop/>
            <SectionAboutUsTrusted/>
        </main>
    )
}

export default AboutUs;