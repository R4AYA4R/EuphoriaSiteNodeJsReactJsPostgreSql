import SectionUnderTop from "../components/SectionUnderTop";

const Catalog = () => {
    return(
        <main className="main">
            <SectionUnderTop subtext="Shop" /> {/* указываем пропс(параметр) subtext(в данном случае со значением Shop,чтобы отобразить в этой секции текст Shop,так как это для страницы каталога),чтобы использовать этот компонент на разных страницах,а отличаться он будет только этим параметром subtext */}
            catalog 
        </main>
    )
}

export default Catalog;