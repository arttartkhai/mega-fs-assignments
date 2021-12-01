import { MODAL } from '../constant/type';

const Modal = ({ payload, closePopup }) => {
  const { type, message } = payload;
  // TODO: add more type option
  const isSuccessType = type === MODAL.SUCCESS;

  return (
    <div class="flex flex-col space-y-4 min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-gray-900">
      <div class="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-800 w-64 m-auto">
        <div class="w-full h-full text-center">
          <div class="flex h-full flex-col justify-between">
            {isSuccessType && (
              <svg
                class="h-12 w-12 mt-4 m-auto text-green-500"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            )}
            <p class="text-gray-600 dark:text-gray-100 text-md py-2 px-6">
              {message}
            </p>
            <div class="flex items-center justify-between gap-4 w-full mt-8">
              <button
                type="button"
                class="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-2xl "
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
