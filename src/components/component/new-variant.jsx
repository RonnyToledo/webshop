import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NewVariant() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      <header className="flex items-center w-full h-16 px-4 bg-black text-white">
        <h1 className="text-xl font-bold">Food&Go</h1>
        <div className="flex items-center ml-auto">
          <BellIcon className="w-6 h-6 text-white" />
        </div>
      </header>
      <main className="flex flex-col w-full max-w-md p-4 space-y-4 bg-white rounded-t-3xl">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <Input
            type="search"
            placeholder="Search restaurants or meals"
            className="w-full pl-10 pr-4 py-2 border rounded-full"
          />
        </div>
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Categories</h2>
            <Link href="#" className="text-sm text-gray-500" prefetch={false}>
              View All
            </Link>
          </div>
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <Badge variant="default" className="snap-center">
              Fast Food
            </Badge>
            <Badge variant="default" className="snap-center">
              Pizza
            </Badge>
            <Badge variant="default" className="snap-center">
              Vegetarian
            </Badge>
            <Badge variant="default" className="snap-center">
              Sushi
            </Badge>
            <Badge variant="default" className="snap-center">
              Mexican
            </Badge>
            <Badge variant="default" className="snap-center">
              Italian
            </Badge>
          </div>
        </section>
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Recommended</h2>
            <Link href="#" className="text-sm text-gray-500" prefetch={false}>
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-2">
              <img
                src="/placeholder.svg"
                alt="Vegan toast"
                className="w-full h-24 object-cover rounded-lg"
                width="100"
                height="100"
                style={{ aspectRatio: "100/100", objectFit: "cover" }}
              />
              <div className="mt-2">
                <h3 className="text-sm font-semibold">Vegan toast</h3>
                <p className="text-sm text-gray-500">$20</p>
              </div>
            </Card>
            <Card className="p-2">
              <img
                src="/placeholder.svg"
                alt="Beef medallions"
                className="w-full h-24 object-cover rounded-lg"
                width="100"
                height="100"
                style={{ aspectRatio: "100/100", objectFit: "cover" }}
              />
              <div className="mt-2">
                <h3 className="text-sm font-semibold">Beef medallions</h3>
                <p className="text-sm text-gray-500">$60</p>
              </div>
            </Card>
          </div>
        </section>
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Top sellers</h2>
            <Link href="#" className="text-sm text-gray-500" prefetch={false}>
              View All
            </Link>
          </div>
          <div className="flex space-x-2">
            <Card className="p-2">
              <img
                src="/placeholder.svg"
                alt="Top seller 1"
                className="w-24 h-24 object-cover rounded-lg"
                width="100"
                height="100"
                style={{ aspectRatio: "100/100", objectFit: "cover" }}
              />
            </Card>
            <Card className="p-2">
              <img
                src="/placeholder.svg"
                alt="Top seller 2"
                className="w-24 h-24 object-cover rounded-lg"
                width="100"
                height="100"
                style={{ aspectRatio: "100/100", objectFit: "cover" }}
              />
            </Card>
            <Card className="p-2">
              <img
                src="/placeholder.svg"
                alt="Top seller 3"
                className="w-24 h-24 object-cover rounded-lg"
                width="100"
                height="100"
                style={{ aspectRatio: "100/100", objectFit: "cover" }}
              />
            </Card>
          </div>
        </section>
      </main>
      <footer className="flex justify-around w-full h-16 bg-white border-t">
        <Button variant="ghost" size="icon" className="rounded-full">
          <HomeIcon className="w-6 h-6 text-yellow-500" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ShoppingCartIcon className="w-6 h-6 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <HeartIcon className="w-6 h-6 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserIcon className="w-6 h-6 text-gray-500" />
        </Button>
      </footer>
    </div>
  );
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function HeartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ShoppingCartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
