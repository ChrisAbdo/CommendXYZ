import React from "react";
import Web3 from "web3";
import Commend from "backend/build/contracts/Commend.json";
import NFT from "backend/build/contracts/NFT.json";

export default function GiveCommend() {
  const [isValid, setIsValid] = React.useState(false);
  const [commendCount, setCommendCount] = React.useState(0);
  const [heatCount, setHeatCount] = React.useState(0);

  function handleInput(event: any) {
    if (event.target.validity.valid) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }

  return (
    <div className="bg-white px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Give Commend
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Here you can give a commend to someone. All you have to do is enter
            their wallet address and a short message!
          </p>
        </div>
        <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Please Enter the Wallet Address of the Person You Want to
                Commend
              </label>
              <div className="mt-1 rounded-md">
                <input
                  type="text"
                  name="name"
                  id="sellerAddress"
                  autoComplete="off"
                  pattern="^(0x)?[0-9a-fA-F]{40}$"
                  className="valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="0x..."
                  required
                  onInput={handleInput}
                  title="Input value must be equal to 0x123..."
                />

                {isValid ? (
                  <span className="mt-2 text-sm text-green-500">
                    This is a valid Ethereum address.
                  </span>
                ) : (
                  <span className="mt-2 hidden text-sm text-red-400">
                    This is not a valid Ethereum address.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-700"
            >
              Short Message
            </label>
            <div className="mt-1">
              <textarea
                id="about"
                name="about"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="This section should explain how this user has helped you and why you are giving them a commend."
                defaultValue={""}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Give Commend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
