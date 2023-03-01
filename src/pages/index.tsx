import { Button } from "@/components/ui/button";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.4,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const features = [
  {
    name: "Build Trust",
    description:
      "Commend users for their contributions to your community. Commends can range from a simple thank you to a full-blown testimonial.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Easy to use",
    description:
      "Explore Commend with no problems. We've made it easy to use and understand. If you run into any issues, please message me on Twitter @abdo_eth",
    icon: LockClosedIcon,
  },
  {
    name: "On-Chain",
    description:
      "Commend is built on the Ethereum blockchain, more specifically the Polygon network. This means that all of your data is stored on-chain and is secure from any reentrancy attacks with the use of the OpenZeppelin library.",
    icon: ServerIcon,
  },
];

export default function Home() {
  return (
    <AnimatePresence>
      <main>
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
          <svg
            className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
          >
            <path
              fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9089FC" />
                <stop offset={1} stopColor="#FF80B5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              {/* <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
              The Easiest On-Chain Reputation System
            </h1> */}
              <motion.div
                variants={variants}
                initial="initial"
                animate="animate"
              >
                <motion.h1
                  className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
                  variants={itemVariants}
                >
                  The Easiest On-Chain Reputation System
                </motion.h1>
                <motion.p
                  className="mt-6 text-lg leading-8 text-gray-600"
                  variants={itemVariants}
                >
                  Welcome to Commend, an on-chain reputation system that allows
                  you to build trust with your community.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="mt-10 flex items-center justify-center gap-x-6"
                >
                  <Button variant="default">
                    <Link href="/create-profile">Get started</Link>
                  </Button>
                  <a
                    href="#"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </motion.div>
              </motion.div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="/app.jpg"
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <svg
              className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
              viewBox="0 0 1155 678"
            >
              <path
                fill="url(#b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
              />
              <defs>
                <linearGradient
                  id="b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1"
                  x1="1155.49"
                  x2="-78.208"
                  y1=".177"
                  y2="474.645"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9089FC" />
                  <stop offset={1} stopColor="#FF80B5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="overflow-hidden  py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="lg:pr-8 lg:pt-4">
                {/* <div className="lg:max-w-lg">
                  <h2 className="text-base font-semibold leading-7 text-indigo-600">
                    Give and receive commends
                  </h2>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    A better way to build trust, directly from the community.
                  </p>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Commend allows you to commend anyone with a valid Ethereum
                    address and a profile on the platform. Commends are stored
                    on-chain and can be viewed by anyone.
                  </p>
                  <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                    {features.map((feature) => (
                      <div key={feature.name} className="relative pl-9">
                        <dt className="inline font-semibold text-gray-900">
                          <feature.icon
                            className="absolute top-1 left-1 h-5 w-5 text-indigo-600"
                            aria-hidden="true"
                          />
                          {feature.name}
                        </dt>{" "}
                        <dd className="inline">{feature.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div> */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 },
                  }}
                >
                  <motion.div
                    className="lg:max-w-lg"
                    initial="hidden"
                    animate="visible"
                    whileInView="visible"
                    variants={{
                      hidden: { opacity: 0, scale: 0 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">
                      Give and receive commends
                    </h2>
                    <motion.p
                      className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                      variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      A better way to build trust, directly from the community.
                    </motion.p>
                    <motion.p
                      className="mt-6 text-lg leading-8 text-gray-600"
                      variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      Commend allows you to commend anyone with a valid Ethereum
                      address and a profile on the platform. Commends are stored
                      on-chain and can be viewed by anyone.
                    </motion.p>
                    <motion.dl
                      className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none"
                      variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      animate="visible"
                      initial="hidden"
                      // @ts-ignore
                      staggerChildren={0.2}
                    >
                      {features.map((feature) => (
                        <motion.div
                          key={feature.name}
                          className="relative pl-9"
                          variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <dt className="inline font-semibold text-gray-900">
                            <feature.icon
                              className="absolute top-1 left-1 h-5 w-5 text-indigo-600"
                              aria-hidden="true"
                            />
                            {feature.name}
                          </dt>{" "}
                          <dd className="inline">{feature.description}</dd>
                        </motion.div>
                      ))}
                    </motion.dl>
                  </motion.div>
                </motion.div>
              </div>
              <img
                src="/commend.jpeg"
                alt="Product screenshot"
                className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                width={2432}
                height={1442}
              />
            </div>
          </div>
        </div>
      </main>
    </AnimatePresence>
  );
}
