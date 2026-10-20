
// import Image from "next/image";
// import img from "../assets/realbiz-logo.png";

const Loading = () => {
  return (
    <main className="fixed inset-0 z-[9999] flex min-h-screen w-full items-center justify-center bg-white">
      <div className="relative flex h-32 w-32 items-center justify-center">
        {/* Spinner */}
        <div
          className="
            absolute inset-0
            animate-spin
            rounded-full
            border-4
            border-transparent
            border-t-[#AFDD24]
            border-r-[#AFDD24]
          "
        />

        {/* Logo */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
          {/* <Image
            src={img}
            alt="RealBiz Logo"
            width={55}
            height={55}
            priority 
            sizes="40"
          /> */}
        </div>
      </div>
    </main>
  );
};

export default Loading;

