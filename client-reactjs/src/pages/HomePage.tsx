import SectionCategories from "../components/SectionCategories";
import SectionFashion from "../components/SectionFashion";
import SectionNewArrivals from "../components/SectionNewArrivals";
import SectionPresents from "../components/SectionPresents";
import SectionSavingZone from "../components/SectionSavingZone";
import SectionTop from "../components/SectionTop";
import SectionTopBrands from "../components/SectionTopBrands";

const HomePage = () => {
    return(
        <main className="main">
            <SectionTop/>
            <SectionPresents/>
            <SectionCategories/>
            <SectionSavingZone/>
            <SectionFashion/>
            <SectionTopBrands/>
            <SectionNewArrivals/>
        </main>
    )
}

export default HomePage;