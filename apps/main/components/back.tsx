import Link from "next/link";

export const GoBack = ({ href, text }: { href: string, text: string }) => {
    return (
        <Link
            href={href}
            title=""
            className="inline-flex items-center
      flex-shrink-0 px-2 py-3 text-base font-semibold
      transition-all duration-200 hover:bg-primary-color hover:text-white rounded-lg"
        >
            {text}
            <svg
                className="pl-2"
                fill="#000000"
                height="30px"
                width="30px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512.001 512.001"
            >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                        {" "}
                        <g>
                            {" "}
                            <path d="M384.834,180.699c-0.698,0-348.733,0-348.733,0l73.326-82.187c4.755-5.33,4.289-13.505-1.041-18.26 c-5.328-4.754-13.505-4.29-18.26,1.041l-82.582,92.56c-10.059,11.278-10.058,28.282,0.001,39.557l82.582,92.561 c2.556,2.865,6.097,4.323,9.654,4.323c3.064,0,6.139-1.083,8.606-3.282c5.33-4.755,5.795-12.93,1.041-18.26l-73.326-82.188 c0,0,348.034,0,348.733,0c55.858,0,101.3,45.444,101.3,101.3s-45.443,101.3-101.3,101.3h-61.58 c-7.143,0-12.933,5.791-12.933,12.933c0,7.142,5.79,12.933,12.933,12.933h61.58c70.12,0,127.166-57.046,127.166-127.166 C512,237.745,454.954,180.699,384.834,180.699z"></path>{" "}
                        </g>{" "}
                    </g>{" "}
                </g>
            </svg>
        </Link>
    );
};

export default GoBack;