import React from "react";
import Image from "next/image";
import { useAddress } from "@thirdweb-dev/react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

import Web3 from "web3";
import Commend from "backend/build/contracts/Commend.json";
import NFT from "backend/build/contracts/NFT.json";
import Link from "next/link";

const ipfsClient = require("ipfs-http-client");
const projectId = "2FdliMGfWHQCzVYTtFlGQsknZvb";
const projectSecret = "2274a79139ff6fdb2f016d12f713dca1";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function CreateProfile() {
  const address = useAddress();
  const [isValid, setIsValid] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState<File | null>(null);
  const [formInput, updateFormInput] = React.useState({
    walletAddress: "",
    coverImage: "",
  });
  const [addressListed, setAddressListed] = React.useState(false);
  const [fileUrl, setFileUrl] = React.useState(null);

  React.useEffect(() => {
    checkListed();
  }, []);

  function handleInput(event: any) {
    if (event.target === address) {
      // only validate if name is "walletAddress"
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }

  async function onChange(e: any) {
    // upload image to IPFS

    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog: any) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);

      // @ts-ignore
      setFileUrl(url);
      updateFormInput({
        ...formInput,
        coverImage: url,
      });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { walletAddress, coverImage } = formInput;
    if (!walletAddress || !coverImage) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        walletAddress,
        coverImage,
      });
      try {
        const added = await client.add(data);
        const url = `https://ipfs.io/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction

        return url;
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  }

  async function listNFTForSale() {
    try {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const url = await uploadToIPFS();

      const networkId = await web3.eth.net.getId();

      // Mint the NFT
      // @ts-ignore
      const NFTContractAddress = NFT.networks[networkId].address;
      // @ts-ignore
      const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
      const accounts = await web3.eth.getAccounts();

      const commendContract = new web3.eth.Contract(
        // @ts-ignore
        Commend.abi,
        // @ts-ignore
        Commend.networks[networkId].address
      );

      NFTContract.methods
        .mint(url)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt: any) {
          console.log("minted");
          // List the NFT
          const tokenId = receipt.events.NFTMinted.returnValues[0];
          commendContract.methods
            .listNft(NFTContractAddress, tokenId)
            .send({ from: accounts[0] })
            .on("receipt", function () {
              console.log("listed");
            });
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function checkListed() {
    try {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();

      const commendContract = new web3.eth.Contract(
        // @ts-ignore
        Commend.abi,
        // @ts-ignore
        Commend.networks[networkId].address
      );

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0]; // use the first account in the array

      const listed = await commendContract.methods.hasListedNft(account).call();

      console.log(listed);
      setAddressListed(listed);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {addressListed ? (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon
                className="h-5 w-5 text-blue-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                You already have a profile! Consider commending someone or
                generating a{" "}
                <Link className="underline" href="/receive-commend">
                  receive page
                </Link>
                .
              </p>
              <p className="mt-3 text-sm md:mt-0 md:ml-6">
                <a
                  href="#"
                  className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                >
                  Commend someone
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Profile
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Here you can create your profile. In just a couple steps you will
              start building trust with your community.
            </p>
          </div>
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Please Confirm Your Wallet Address
                </label>
                <div className="mt-1 rounded-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="off"
                    pattern={address}
                    className="valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0x..."
                    required
                    title="Input value must be equal to 0x123..."
                    onInput={handleInput}
                    onChange={(e) => {
                      updateFormInput({
                        ...formInput,
                        walletAddress: e.target.value,
                      });
                      handleInput(e);
                    }}
                  />
                  {isValid ? (
                    <span className="mt-2 text-sm text-green-500">
                      You have been correctly identified as the owner of this
                      wallet.
                    </span>
                  ) : (
                    <span className="mt-2 hidden text-sm text-red-400">
                      Please enter your wallet address. (you should be connected
                      to this wallet){" "}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              <div className="mt-1 flex items-center space-x-5">
                <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  {profileImage ? (
                    <Image
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile Image"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>

                <input
                  type="file"
                  className="w-1/2 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  accept="image/*"
                  onChange={onChange}
                />
              </div>

              <button>Upload</button>
            </div>

            <div className="flex justify-end">
              {addressListed ? null : (
                <button
                  onClick={listNFTForSale}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
