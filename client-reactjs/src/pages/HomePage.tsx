import SectionCategories from "../components/SectionCategories";
import SectionPresents from "../components/SectionPresents";
import SectionTop from "../components/SectionTop";

const HomePage = () => {
    return(
        <main className="main">
            <SectionTop/>
            <SectionPresents/>
            <SectionCategories/>
        </main>
    )
}

export default HomePage;