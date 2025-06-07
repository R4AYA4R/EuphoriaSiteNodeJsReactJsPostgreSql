import SectionCategories from "../components/SectionCategories";
import SectionPresents from "../components/SectionPresents";
import SectionSavingZone from "../components/SectionSavingZone";
import SectionTop from "../components/SectionTop";

const HomePage = () => {
    return(
        <main className="main">
            <SectionTop/>
            <SectionPresents/>
            <SectionCategories/>
            <SectionSavingZone/>
        </main>
    )
}

export default HomePage;