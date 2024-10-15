import InfiniteLoopSVG from "@/components/InfiniteLoopSVG";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 sm:px-8 lg:px-12">
      <InfiniteLoopSVG />
      <h1 className="text-6xl font-bold text-primary mb-8 text-center">Invo</h1>
      <p className="text-3xl text-secondary mb-6 text-center">
        Quick, Simple, Done.
      </p>
      <p className="text-lg text-accent mb-6 text-center max-w-md">
        Log your time and generate invoices seamlessly.
      </p>
      <Link href="/dashboard">
        <div className="text-xl text-background bg-primary py-3 px-6 rounded-lg hover:bg-secondary transition duration-300 ease-in-out transform hover:scale-105">
          Go to Dashboard
        </div>
      </Link>
    </div>
  );
}
