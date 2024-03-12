export default function TestProgress() {

  return (
    <>
      <div>
        <ul
          className="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
          role="tablist"
          data-te-nav-ref
        >
          <li role="presentation" className="flex-auto text-center">
            <a
              href="#tabs-home01"
              className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
              data-te-toggle="pill"
              data-te-target="#tabs-home01"
              data-te-nav-active
              role="tab"
              aria-controls="tabs-home01"
              aria-selected="true"
            >
              Home
            </a>
          </li>
          <li role="presentation" className="flex-auto text-center">
            <a
              href="#tabs-profile01"
              className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
              data-te-toggle="pill"
              data-te-target="#tabs-profile01"
              role="tab"
              aria-controls="tabs-profile01"
              aria-selected="false"
            >
              Profile
            </a>
          </li>
          <li role="presentation" className="flex-auto text-center">
            <a
              href="#tabs-messages01"
              className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
              data-te-toggle="pill"
              data-te-target="#tabs-messages01"
              role="tab"
              aria-controls="tabs-messages01"
              aria-selected="false"
            >
              Messages
            </a>
          </li>
          <li role="presentation" className="flex-auto text-center">
            <a
              href="#tabs-contact01"
              className="disabled pointer-events-none my-2 block border-x-0 border-b-2 border-t-0 border-transparent bg-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-400 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent dark:text-neutral-600"
              data-te-toggle="pill"
              data-te-target="#tabs-contact01"
              role="tab"
              aria-controls="tabs-contact01"
              aria-selected="false"
            >
              Contact
            </a>
          </li>
        </ul>
        {/*Tabs content*/}
        <div className="mb-6">
          <div
            className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="tabs-home01"
            role="tabpanel"
            aria-labelledby="tabs-home-tab01"
            data-te-tab-active
          >
            Tab 1 content
          </div>
          <div
            className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="tabs-profile01"
            role="tabpanel"
            aria-labelledby="tabs-profile-tab01"
          >
            Tab 2 content
          </div>
          <div
            className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="tabs-messages01"
            role="tabpanel"
            aria-labelledby="tabs-profile-tab01"
          >
            Tab 3 content
          </div>
          <div
            className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="tabs-contact01"
            role="tabpanel"
            aria-labelledby="tabs-contact-tab01"
          >
            Tab 4 content
          </div>
        </div>
      </div>
    </>
  );
}
