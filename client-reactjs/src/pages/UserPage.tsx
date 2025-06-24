import SectionUnderTop from "../components/SectionUnderTop";
import UserPageFormComponent from "../components/UserPageFormComponent";


const UserPage = () => {
    return (
        <main className="main">

            <SectionUnderTop subtext="My Account" /> {/* указываем пропс(параметр) subtext(в данном случае со значением My Account,чтобы отобразить в этой секции текст My Account,так как это для страницы аккаунта пользователя),чтобы использовать этот компонент на разных страницах,а отличаться он будет только этим параметром subtext */}

            <UserPageFormComponent/>            

        </main>
    )
}

export default UserPage;