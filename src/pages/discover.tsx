import React from "react";
import Image from "next/image";
import Web3 from "web3";
import Commend from "../../backend/build/contracts/Commend.json";
import NFT from "../../backend/build/contracts/NFT.json";
import axios from "axios";
import { Combobox, Dialog, Transition } from "@headlessui/react";
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
  Bars4Icon,
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
  const [query, setQuery] = React.useState("");

  const [open, setOpen] = React.useState(true);

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
          const descriptions = i.descriptions.join("\n");

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
        .giveCommend(nfts.tokenId, 1, "Test21")
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
    // <div>

    //   {nfts.length ? (
    //     nfts.map((nft, index) => (
    //       <>
    //         <li key={index} className={`flex p-2 rounded-md card3 `}>
    //           <Image
    //             // @ts-ignore
    //             src={nft.coverImage}
    //             height={50}
    //             width={50}
    //             alt="nft"
    //             className="w-12 h-12 border border-gray-200 dark:border-[#303030] rounded"
    //             priority
    //           />
    //           <div className="flex flex-col text-left ml-2">
    //             <h1 className="text-sm font-semibold text-gray-800">
    //               {/* @ts-ignore */}
    //               {nft.walletAddress}
    //             </h1>
    //             <h1 className="text-xs text-gray-400">
    //               {/* @ts-ignore */}
    //               {nft.seller.substring(0, 5)}... {/* @ts-ignore */}
    //               {nft.seller.substring(38, 42)}
    //             </h1>
    //           </div>
    //         </li>
    //       </>
    //     ))
    //   ) : (
    //   <div className="bg-white p-2 sm:p-4 sm:h-64 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-5 select-none ">
    //   <div className="h-52 sm:h-full sm:w-72 rounded-xl bg-gray-200 animate-pulse"></div>
    //   <div className="flex flex-col flex-1 gap-5 sm:p-2">
    //     <div className="flex flex-1 flex-col gap-3">
    //       <div className="bg-gray-200 w-full animate-pulse h-14 rounded-2xl"></div>
    //       <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
    //       <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
    //       <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
    //       <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
    //     </div>
    //     <div className="mt-auto flex gap-3">
    //       <div className="bg-gray-200 w-20 h-8 animate-pulse rounded-full"></div>
    //       <div className="bg-gray-200 w-20 h-8 animate-pulse rounded-full"></div>
    //       <div className="bg-gray-200 w-20 h-8 animate-pulse rounded-full ml-auto"></div>
    //     </div>
    //   </div>
    // </div>
    //   )}
    // </div>

    <div>
      <input
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search"
        className="bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-md py-2 px-4 block w-full appearance-none leading-normal"
      />
      <div className="lg:p-24 p-6">
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
                        <p className="truncate text-sm font-medium text-gray-900">
                          {/* @ts-ignore */}
                          {nft.walletAddress}
                        </p>
                        {/* <p className="truncate text-sm text-gray-500">{'@' + person.handle}</p> */}
                      </div>
                      <div className="space-x-2">
                        <span
                          onClick={() => handleGiveHeat(nft)}
                          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          {/* @ts-ignore */}
                          {nft.commendCount}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          {/* @ts-ignore */}
                          {nft.description}
                        </span>
                        <button
                          onClick={() => handleGiveHeat(nft)}
                          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          Commend
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              : // <div className="bg-white p-2 sm:p-4 sm:h-64 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-5 select-none ">
                //   <div className="h-52 sm:h-full sm:w-72 rounded-xl bg-gray-200 animate-pulse"></div>
                //   <div className="flex flex-col flex-1 gap-5 sm:p-2">
                //     <div className="flex flex-1 flex-col gap-3">
                //       <div className="bg-gray-200 w-full animate-pulse h-14 rounded-2xl"></div>
                //       <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                //       <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                //       <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                //       <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                //     </div>
                //     <div className="mt-auto flex gap-3">
                //       <div className="bg-gray-200 w-20 h-8 animate-pulse rounded-full"></div>
                //       <div className="bg-gray-200 w-20 h-8 animate-pulse rounded-full"></div>
                //       <div className="bg-gray-200 w-20 h-8 animate-pulse rounded-full ml-auto"></div>
                //     </div>
                //   </div>
                // </div>

                // map with 5 items please
                [...Array(5)].map((_, index) => (
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
