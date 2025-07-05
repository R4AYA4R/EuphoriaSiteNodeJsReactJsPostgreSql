import { ChangeEvent, useState } from "react";

const ProductItemCart = () => {

    const [inputAmountValue, setInputAmountValue] = useState(1);

    const [valueDiscount, setValueDiscount] = useState<number>(0);  // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number


    // функция для изменения значения инпута количества товара,указываем параметру e(event) тип как ChangeEvent<HTMLInputElement>
    const changeInputAmountValue = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение инпута > 99,то изменяем состояние инпута цены на 99,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число
        if (+e.target.value > 99) {

            setInputAmountValue(99);

        } else if (+e.target.value <= 0) {

            // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
            setInputAmountValue(0);

        } else {

            setInputAmountValue(+e.target.value); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

        }

    }

    const handlerMinusAmountBtn = () => {

        // если значение инпута количества товара больше 1,то изменяем это значение на - 1,в другом случае указываем ему значение 1,чтобы после нуля или 1 не отнимало - 1
        if (inputAmountValue > 1) {

            setInputAmountValue((prev) => prev - 1);

        } else {

            setInputAmountValue(1);

        }

    }

    const handlerPlusAmountBtn = () => {

        // если значение инпута количества товара меньше 99 и больше или равно 0,то изменяем это значение на + 1,в другом случае указываем ему значение 99,чтобы больше 99 не увеличивалось
        if (inputAmountValue < 99 && inputAmountValue >= 0) {

            setInputAmountValue((prev) => prev + 1);

        } else {

            setInputAmountValue(99);

        }

    }

    return (
        <div className="sectionCart__productsBlock-product">
            <div className="sectionCart__product-detailsBlock">

                <div className="sectionNewArrivals__item-saleBlock sectionCart__product-saleBlock">35%</div>

                <div className="sectionNewArrivals__item-saleBlockHot sectionCart__product-saleBlockHot">HOT</div>

                <img src="/images/sectionNewArrivals/Rectangle 25.jpg" alt="" className="sectionCart__product-img" />
                <div className="sectionCart__product-detailsBlockInfo">
                    <h1 className="sectionCart__product-name">Blue Flower Print Crop Top</h1>
                    <p className="sectionCart__product-size">Size: M</p>
                </div>
            </div>

            {/* <p className="sectionCart__product-price">$29.00</p> */}

            <div className="sectionNewArrivals__item-priceBlock sectionCart__product-priceBlock">
                <p className="item__priceBlock-priceSale sectionCart__product-priceSale">$10</p>
                <p className="item__priceBlock-priceUsual sectionCart__product-price">$15</p>
            </div>

            <div className="sectionProductItemPage__cartBlock-inputBlock">
                <button className="cartBlock__inputBlock-btn cartBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtn}>
                    <img src="/images/sectionProductItemPage/Minus.png" alt="" className="cartBlock__inputBlock-btnImg" />
                </button>
                <input type="number" className="cartBlock__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                <button className="cartBlock__inputBlock-btn cartBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtn}>
                    <img src="/images/sectionProductItemPage/Plus.png" alt="" className="cartBlock__inputBlock-btnImg" />
                </button>
            </div>
            <p className="sectionCart__product-price">$29.00</p>
            <button className="sectionCart__product-deleteBtn">
                <img src="/images/sectionCart/deletecon.png" alt="" className="sectionCart__product-deleteBtnImg" />
            </button>
        </div>
    )

}

export default ProductItemCart;