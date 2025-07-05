import { RefObject, useRef } from "react";
import ProductItemCart from "../components/ProductItemCart";
import SectionUnderTop from "../components/SectionUnderTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";


const Cart = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <main className="main">
            <SectionUnderTop subtext="Cart" />
            <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active sectionCart" : "sectionCatalog sectionCart"} ref={sectionCatalog}>
                <div className="container">
                    <div className="sectionCart__inner">
                        <div className="sectionCart__table">
                            <div className="sectionCart__table-names">
                                <p className="sectionCart__table-name">Product Details</p>
                                <p className="sectionCart__table-name">Price</p>
                                <p className="sectionCart__table-name">Quantity</p>
                                <p className="sectionCart__table-name">Subtotal</p>
                                <p className="sectionCart__table-name">Action</p>
                            </div>
                            <div className="sectionCart__table-mainBlock">

                                <div className="sectionCart__table-productsBlock">

                                    <ProductItemCart />

                                </div>

                                <div className="sectionCart__table-bottomBlock">
                                    <button className="sectionCart__table-bottomBlockClearBtn">Clear Cart</button>

                                    <button className="sectionCart__table-bottomBlockUpdateBtn">Update Cart</button>
                                </div>

                            </div>
                        </div>
                        <div className="sectionCart__bill">
                            <div className="sectionCart__bill-topBlock">
                                <div className="sectionCart__bill-topBlockItem">
                                    <p className="bill__topBlockItem-text">Subtotal</p>
                                    <p className="bill__topBlockItem-subtext">$513.00</p>
                                </div>
                                <div className="sectionCart__bill-topBlockItem">
                                    <p className="bill__topBlockItem-text">Shipping</p>
                                    <p className="bill__topBlockItem-subtext">$5.00</p>
                                </div>
                            </div>
                            <div className="sectionCart__bill-bottomBlock">
                                <div className="sectionCart__bill-topBlockItem">
                                    <p className="bill__bottomBlockItem-text">Total</p>
                                    <p className="bill__bottomBlockItem-subtext">$518.00</p>
                                </div>
                                <button className="sectionCart__bill-btn">Proceed To Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Cart;