import React from "react";
import Image from "next/image";
import Web3 from "web3";
import Commend from "../../backend/build/contracts/Commend.json";
import NFT from "../../backend/build/contracts/NFT.json";
import axios from "axios";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  CodeBracketIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  LinkIcon,
  PencilSquareIcon,
  PhotoIcon,
  TableCellsIcon,
  VideoCameraIcon,
  ViewColumnsIcon,
  CheckIcon,
  Bars4Icon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const items = [
  {
    id: 1,
    name: "Text",
    description: "Add freeform text with basic formatting options.",
    url: "#",
    color: "bg-indigo-500",
    icon: PencilSquareIcon,
  },
  // More items...
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Discover() {
  const [nfts, setNfts] = React.useState([]);
  const [commendCount, setCommendCount] = React.useState(0);
  const [commendDescription, setCommendDescription] = React.useState("");
  const [query, setQuery] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [descriptionOpen, setDescriptionOpen] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState(null);

  const cancelButtonRef = React.useRef(null);
  const filteredItems =
    query === ""
      ? nfts
      : nfts.filter((item) =>
          // @ts-ignore
          item.walletAddress.toLowerCase().includes(query.toLowerCase())
        );

  React.useEffect(() => {
    loadSongs();
  }, []);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey && event.key === "k") {
        // @ts-ignore
        document.getElementById("search").focus();
        event.preventDefault();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function loadSongs() {
    console.log("Loading songs...");
    // @ts-ignore
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      // @ts-ignore
      Commend.abi,
      // @ts-ignore
      Commend.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i: any) => {
        try {
          const NFTContract = new web3.eth.Contract(
            // @ts-ignore
            NFT.abi,
            // @ts-ignore
            NFT.networks[networkId].address
          );
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          const descriptions = i.descriptions;

          const nft = {
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,

            walletAddress: meta.data.walletAddress,
            coverImage: meta.data.coverImage,
            commendCount: i.commendCount,
            description: descriptions,
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    // setNfts(nfts.filter((nft) => nft !== null));

    // set nfts in order of heatCount
    const sortedNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => b.commendCount - a.commendCount);
    const topThreeNfts = sortedNfts.slice(0, 5);

    // @ts-ignore
    setNfts(sortedNfts);
  }

  async function handleGiveHeat(nfts: any) {
    // Get an instance of the Radio contract
    try {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const radioContract = new web3.eth.Contract(
        // @ts-ignore
        Commend.abi,
        // @ts-ignore
        Commend.networks[networkId].address
      );

      radioContract.methods
        .giveCommend(nfts.tokenId, 1, commendDescription)
        .send({
          // @ts-ignore
          from: window.ethereum.selectedAddress,

          value: web3.utils.toWei("0.1", "ether"),
        })
        .on("receipt", function () {
          console.log("listed");
        });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div className="lg:p-24 p-6">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            Quick search
          </label>
          <div className="relative mt-1 flex items-center">
            <input
              type="text"
              name="search"
              id="search"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by wallet address or ENS..."
              className="block w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
        <div className="mt-6 flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {/* {nfts.length
              ? nfts.map((nft, index) => ( */}
            {filteredItems.length
              ? filteredItems.map((nft, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          // @ts-ignore
                          src={nft.coverImage}
                          alt=""
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-md font-medium text-gray-900">
                          {/* @ts-ignore */}
                          {nft.walletAddress}
                        </p>
                        {/* <p className="truncate text-sm text-gray-500">{'@' + person.handle}</p> */}
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => setSelectedNFT(nft)}
                          className="inline-flex items-center rounded-full border border-black bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm transition duration-300 hover:bg-gray-100"
                        >
                          {/* @ts-ignore */}
                          {nft.commendCount} Reviews
                        </button>

                        <button
                          onClick={() => setOpen(true)}
                          className="inline-flex items-center rounded-full border border-indigo-600 text-indigo-600 bg-indigo-200 px-2.5 py-0.5 text-sm font-medium leading-5  shadow-sm transition duration-300 hover:bg-indigo-200/80"
                        >
                          Commend
                        </button>
                      </div>
                    </div>

                    <Transition.Root
                      show={selectedNFT === nft}
                      as={React.Fragment}
                    >
                      <Dialog
                        as="div"
                        className="relative z-10"
                        // @ts-ignore
                        onClose={setSelectedNFT}
                      >
                        <Transition.Child
                          as={React.Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 overflow-y-auto">
                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                              as={React.Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                              enterTo="opacity-100 translate-y-0 sm:scale-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <Image
                                      // @ts-ignore
                                      src={nft.coverImage}
                                      width={50}
                                      height={50}
                                      alt="cover"
                                      className="rounded-full"
                                    />
                                  </div>
                                  <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title
                                      as="h3"
                                      className="text-base font-semibold leading-6 text-gray-900"
                                    >
                                      {/* @ts-ignore */}
                                      {nft.walletAddress.slice(0, 5) +
                                        "..." +
                                        // @ts-ignore
                                        nft.walletAddress.slice(-4)}
                                      &apos;s Commends
                                    </Dialog.Title>
                                    {/* <ul
                                      role="list"
                                      className="divide-y divide-gray-200"
                                    >
                                      <li className="flex py-4">
                                        <div className="">
                                          {nft.description.map(
                                            (desc: any, index: any) => (
                                              <React.Fragment key={index}>
                                                <div className="w-full bg-gray-100 rounded-lg p-2">
                                                  <p className="text-sm text-gray-900">
                                                    {desc}
                                                  </p>
                                                </div>
                                                {index <
                                                  nft.description.length -
                                                    1 && <br />}{" "}
                                              </React.Fragment>
                                            )
                                          )}
                                        </div>
                                      </li>
                                    </ul> */}

                                    <ScrollArea.Root className="w-full h-[225px] rounded overflow-hidden  bg-white">
                                      <ScrollArea.Viewport className="w-full h-full rounded">
                                        <div className="py-[15px] px-5">
                                          {/* @ts-ignore */}
                                          {nft.description.map(
                                            (desc: any, index: any) => (
                                              <React.Fragment key={index}>
                                                <div className="w-full bg-gray-100 transition duration-2 hover:bg-gray-200 rounded-lg p-2">
                                                  <p className="text-sm text-gray-900">
                                                    {desc}
                                                  </p>
                                                </div>
                                                {index <
                                                  // @ts-ignore
                                                  nft.description.length -
                                                    1 && <br />}{" "}
                                              </React.Fragment>
                                            )
                                          )}
                                        </div>
                                      </ScrollArea.Viewport>
                                      <ScrollArea.Scrollbar
                                        className="flex select-none touch-none p-0.5 bg-gray-200 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                                        orientation="vertical"
                                      >
                                        <ScrollArea.Thumb className="flex-1 bg-indigo-600 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                                      </ScrollArea.Scrollbar>
                                      <ScrollArea.Scrollbar
                                        className="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                                        orientation="horizontal"
                                      >
                                        <ScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                                      </ScrollArea.Scrollbar>
                                      <ScrollArea.Corner className="bg-blackA8" />
                                    </ScrollArea.Root>
                                  </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                  <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                    onClick={() => setSelectedNFT(null)}
                                  >
                                    Go back to dashboard
                                  </button>
                                </div>
                              </Dialog.Panel>
                            </Transition.Child>
                          </div>
                        </div>
                      </Dialog>
                    </Transition.Root>

                    {/* Give Commend Modal */}
                    <Transition.Root show={open} as={React.Fragment}>
                      <Dialog
                        as="div"
                        className="relative z-10"
                        initialFocus={cancelButtonRef}
                        onClose={setOpen}
                      >
                        <Transition.Child
                          as={React.Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 overflow-y-auto">
                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                              as={React.Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                              enterTo="opacity-100 translate-y-0 sm:scale-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <CheckIcon
                                      className="h-6 w-6 text-green-600"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title
                                      as="h3"
                                      className="text-base font-semibold leading-6 text-gray-900"
                                    >
                                      Give Commend
                                    </Dialog.Title>
                                    <div className="mt-2">
                                      <div>
                                        <label
                                          htmlFor="comment"
                                          className="block text-sm font-medium text-gray-700"
                                        >
                                          Write a commend here. It should be a
                                          short description of how the person
                                          has helped you or how they have been a
                                          person.
                                        </label>
                                        <div className="mt-1">
                                          <textarea
                                            rows={4}
                                            name="comment"
                                            id="comment"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            defaultValue={""}
                                            onChange={(event) =>
                                              setCommendDescription(
                                                event.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                  <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                    onClick={() => handleGiveHeat(nft)}
                                  >
                                    Submit Commend
                                  </button>
                                  <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                    onClick={() => setOpen(false)}
                                    ref={cancelButtonRef}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Dialog.Panel>
                            </Transition.Child>
                          </div>
                        </div>
                      </Dialog>
                    </Transition.Root>
                  </li>
                ))
              : [...Array(5)].map((_, index) => (
                  <li className="py-4" key={index}>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="bg-gray-200 w-8 h-8 animate-pulse rounded-full"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="bg-gray-200 w-full h-8 animate-pulse rounded-full"></div>
                        {/* <p className="truncate text-sm text-gray-500">{'@' + person.handle}</p> */}
                      </div>
                      <div>
                        <div className="bg-gray-200 w-20 h-8 animate-pulse rounded-full"></div>
                      </div>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
        <div className="mt-6">
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            View all
          </a>
        </div>
      </div>
    </div>
  );
}
