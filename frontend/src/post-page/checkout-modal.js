export default function CheckoutModal(props) {
  const duration = props.duration;
  const featured = props.featured;
  const featuredCost = props.featuredCost;
  const checkoutModalIsOpen = props.checkoutModalIsOpen;
  const setCheckoutModalIsOpen = props.setCheckoutModalIsOpen;
  const handleCheckout = props.handleCheckout;

  return (
    <div
      className={`z-50 fixed ${
        checkoutModalIsOpen ? "" : "hidden"
      } inset-0 w-screen h-screen blur-lg flex justify-center place-items-center`}
    >
      <div
        className={`max-w-lg w-full mx-3 my-3 pt-12 pb-10 flex flex-col justify-center place-items-center border border-gray-200 rounded-lg md:rounded-2xl bg-gray-100 shadow-xl`}
      >
        <div className="max-w-xs w-full mx-5">
          <div className="w-full px-3 pb-4 mb-2 border-b border-gray-400">
            <div className="flex">
              <p>
                Link Duration
                <span className="ml-1 font-semibold text-sm">
                  ( {duration.duration} )
                </span>
              </p>
              <p className="flex-grow"></p>
              <p>${duration.cost.toFixed(2)}</p>
            </div>
            {featured ? (
              <div className="flex">
                <p>Featured:</p>
                <p className="flex-grow"></p>
                <p>${featuredCost}</p>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="px-3 flex">
            <p className="mr-2 tracking-wide">Total:</p>
            <p className="flex-grow"></p>
            <p className="text-red-500">
              ${(duration.cost + featuredCost).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex mt-12">
          <button
            onClick={(e) => {
              e.preventDefault();
              setCheckoutModalIsOpen(false);
            }}
            className="mx-3 px-3.5 py-1.5 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-red focus:outline-none hover:shadow-md opacity-90 hover:opacity-100"
          >
            <span className="uppercase font-semibold font-title tracking-widest text-sm text-gray-100">
              Cancel
            </span>
          </button>
          <button
            onClick={handleCheckout}
            className="mx-3 px-3.5 py-1.5 ring-1 ring-gray-200 rounded-md shadow-sm bg-primary-blue focus:outline-none hover:shadow-md opacity-90 hover:opacity-100"
          >
            <span className="uppercase font-semibold font-title tracking-widest text-sm text-gray-100">
              Checkout &amp; Post
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
