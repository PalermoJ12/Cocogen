import React from "react";

const ItemCard = ({ ItemName, ItemPrice, addToCart }) => {
    return (
        <div className="card w-80 border border-base-content bg-base-100 card-sm shadow-sm">
            <div className="card-body">
                <h2 className="card-title"> ₱ {ItemPrice}</h2>
                <p className="text-1xl">
                   {ItemName}
                </p>
                <div className="justify-end card-actions">
                    <button className="btn btn-primary" onClick={addToCart}>Add to cart</button>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
