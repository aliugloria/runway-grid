import "../App.css";
const Socials = () => {
  return (
    <section className=" w-full px-4">
      <div className="social w-full flex items-end justify-end pb-1">
        <ul className="flex items-center gap-2">
          <li>
            <a
              href="https://github.com/aliugloria"
              target="_blank"
              className="flex items-center text-xs font-semibold"
            >
              <svg
                className="button-icon h-4 w-4"
                role="presentation"
                aria-hidden="true"
              >
                <use href="/icons.svg#github-icon"></use>
              </svg>
              GitHub
            </a>
          </li>

          <li>
            <a
              href="https://x.com/gigi_devv"
              target="_blank"
              className="flex items-center text-xs font-semibold"
            >
              <svg
                className="button-icon h-4 w-4"
                role="presentation"
                aria-hidden="true"
              >
                <use href="/icons.svg#x-icon"></use>
              </svg>
              X.com
            </a>
          </li>

          <li>
            <a
              href="https://www.linkedin.com/in/gloria-aliu/"
              target="_blank"
              className="flex items-center text-xs gap-0.5 font-semibold"
            >
              <svg
                className="button-icon h-4 w-4 border border-gray-400 rounded-xs"
                role="presentation"
                aria-hidden="true"
              >
                <use href="/icons.svg#linkedin-icon"></use>
              </svg>
              Linkedin
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Socials;
