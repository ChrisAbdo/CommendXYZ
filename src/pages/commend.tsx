import React from "react";
import Image from "next/image";
import Web3 from "web3";
import Commend from "../../backend/build/contracts/Commend.json";
import NFT from "../../backend/build/contracts/NFT.json";
import axios from "axios";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useToast } from "@/hooks/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

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
import { Button } from "@/components/ui/button";

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
  const [roleQuery, setRoleQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState(null);
  const [selectedNFTCommends, setSelectedNFTCommends] = React.useState(null);
  const [ensOpen, setEnsOpen] = React.useState(false);

  const cancelButtonRef = React.useRef(null);
  const filteredItems =
    query === ""
      ? nfts
      : nfts.filter(
          (item) =>
            // @ts-ignore
            item.walletAddress.toLowerCase().includes(query.toLowerCase()) ||
            // @ts-ignore
            item.role.toLowerCase().includes(query.toLowerCase())
        );

  const { toast } = useToast();

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
            role: meta.data.role,
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
    toast({
      title: "Giving Commend...",
      description: "Please confirm the transaction in your wallet.",
    });
    try {
      setLoading(true);
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

          value: web3.utils.toWei("0.001", "ether"),
        })
        .on("receipt", function () {
          console.log("listed");
          toast({
            title: "Successfully gave Commend",
            description: "Thanks for improving the community.",
          });
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function setQueryBySelect(select: any) {
    setQuery(select);
    toast({
      // title: "Filtered by " + select,
      // do the same thing but if select is empty, then say "All"
      title: select ? "Filtered by " + select : "Showing all",
    });
  }

  return (
    <div>
      <div className="lg:p-12 p-6">
        <div className="flex justify-between mb-4">
          <Select onValueChange={setQueryBySelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Marketer">Marketer</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Business Analyst">
                  Business Analyst
                </SelectItem>
                <SelectItem value="Product Designer">
                  Product Designer
                </SelectItem>
                <SelectItem value="Influencer">Influencer</SelectItem>
                <SelectItem value="Community Manager">
                  Community Manager
                </SelectItem>
                <SelectItem value="Content Creator">Content Creator</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setEnsOpen(true)}
            className="inline-flex items-center rounded-md  x-2.5 py-1.5 text-sm font-medium leading-5 shadow-sm transition duration-300"
          >
            {/* @ts-ignore */}
            Find / Resolve ENS
          </Button>
        </div>
        {/* Resolve ENS Modal */}
        <Transition.Root show={ensOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                          Resolve ENS | Coming Soon
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Resolve ENS to get the wallet address easily
                          </p>
                        </div>
                        <div className="mt-4 relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                          <label
                            htmlFor="name"
                            className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >
                            ENS
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                            placeholder="ex. abd0x.eth"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={() => setEnsOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        {/* Search Input */}
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
              placeholder="Search by wallet address, role, or ENS..."
              className="block w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Separator />
        </div>

        {roleQuery ? (
          <div className="mt-4">
            <span className="inline-flex items-center rounded-md bg-indigo-100 border border-indigo-200 py-0.5 pl-2.5 pr-1 text-sm font-medium text-black">
              {roleQuery}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setRoleQuery("");
                }}
                className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
              >
                <span className="sr-only">Remove large option</span>
                <svg
                  className="h-2 w-2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 8 8"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    d="M1 1l6 6m0-6L1 7"
                  />
                </svg>
              </button>
            </span>
          </div>
        ) : null}

        <div className="mt-6 flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            <AnimatePresence>
              {filteredItems.length
                ? filteredItems.map((nft, index) => (
                    <motion.li
                      key={index}
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.1, delay: index * 0.1 }}
                      className="py-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Image
                            className="lg:w-16 lg:h-16 w-8 h-8 rounded-md" // @ts-ignore
                            src={nft.coverImage}
                            alt=""
                            width={64}
                            height={64}
                            priority
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-md font-medium text-gray-900">
                            {/* @ts-ignore */}
                            {nft.walletAddress}&nbsp;
                          </p>
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            onClick={() => {
                              // @ts-ignore
                              setQuery(nft.role);
                              // @ts-ignore
                              setRoleQuery(nft.role);
                              toast({
                                // @ts-ignore
                                title: "Filtered by " + nft.role,
                              });
                            }}
                            className="cursor-pointer inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800 border border-[#eaeaea]"
                          >
                            {/* @ts-ignore */}
                            {nft.role}
                          </motion.span>
                        </div>

                        <div className="space-x-2">
                          <button
                            onClick={() => setSelectedNFT(nft)}
                            className="inline-flex items-center rounded-md border border-black bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm transition duration-300 hover:bg-gray-100"
                          >
                            {/* @ts-ignore */}
                            {nft.commendCount} Reviews
                          </button>

                          <button
                            onClick={() => setSelectedNFTCommends(nft)}
                            className="inline-flex items-center rounded-md border border-indigo-600 text-indigo-600 bg-indigo-200 px-2.5 py-0.5 text-sm font-medium leading-5  shadow-sm transition duration-300 hover:bg-indigo-200/80"
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
                                    {/* <button
                                      type="button"
                                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                      onClick={() => setSelectedNFT(null)}
                                    >
                                      Go back to dashboard
                                    </button> */}
                                    <Button
                                      onClick={() => setSelectedNFT(null)}
                                      variant="default"
                                      className="inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                    >
                                      Close
                                    </Button>
                                  </div>
                                </Dialog.Panel>
                              </Transition.Child>
                            </div>
                          </div>
                        </Dialog>
                      </Transition.Root>

                      {/* Give Commend Modal */}
                      <Transition.Root
                        show={selectedNFTCommends === nft}
                        as={React.Fragment}
                      >
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
                                            has helped you or how they have been
                                            a person.
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
                                  <div className="flex space-x-2 mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    {/* <button
                                      type="button"
                                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                      onClick={() => handleGiveHeat(nft)}
                                    >
                                      Submit Commend
                                    </button> */}
                                    {loading ? (
                                      <Button
                                        className="inline-flex w-full justify-center rounded-md border border-transparent  px-4 py-2 text-base font-medium  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                        disabled
                                      >
                                        <svg
                                          className="animate-spin"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          stroke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        >
                                          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                                        </svg>
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="default"
                                        onClick={() => handleGiveHeat(nft)}
                                        className="inline-flex w-full justify-center rounded-md border border-transparent  px-4 py-2 text-base font-medium  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm lg:mt-0 mt-3"
                                      >
                                        Submit
                                      </Button>
                                    )}

                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setSelectedNFTCommends(null)
                                      }
                                      ref={cancelButtonRef}
                                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                    >
                                      Close
                                    </Button>
                                  </div>
                                </Dialog.Panel>
                              </Transition.Child>
                            </div>
                          </div>
                        </Dialog>
                      </Transition.Root>
                    </motion.li>
                  ))
                : [...Array(3)].map((_, index) => (
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
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}
