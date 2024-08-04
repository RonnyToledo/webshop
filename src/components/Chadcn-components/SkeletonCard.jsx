import { Skeleton } from "@/components/ui/skeleton";
import { CardContent, Card } from "@/components/ui/card";

export function HomePage() {
  return (
    <main>
      <section className="w-full py-6 md:py-8 lg:py-10 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            {"abcde".split("").map((char, index) => (
              <Skeleton key={index} className="h-4 w-[full]" />
            ))}
          </p>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 md:px-6">
          {"abcd".split("").map((obj, index) => (
            <div
              className="flex flex-col items-start justify-center space-y-4"
              key={index}
            >
              <Skeleton className="h-[300px] w-full rounded-xl" />
              <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-300  w-full">
                <Skeleton className="h-3 w-11/12" />
              </div>

              <h3 className="text-xl font-bold tracking-tighter  w-full">
                <Skeleton className="h-3 w-11/12" />
              </h3>
              <p className="line-clamp-2 overflow-hidden text-gray-500 md:text-base dark:text-gray-400">
                {"abcde".split("").map((obj, index) => (
                  <Skeleton key={index} className="h-2 w-11/12" />
                ))}
              </p>
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container grid md:grid-cols-2 gap-8 px-4 md:px-6">
          <div className="flex flex-col items-start justify-center space-y-4">
            <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
              <Skeleton className="h-3 w-3/5" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              <Skeleton className="h-3 w-1/3 rounded-xl" />
            </h2>
            <p className="max-w-[500px] text-gray-500 md:text-xl dark:text-gray-400">
              {"ab".split("").map((char, index) => (
                <Skeleton key={index} className="h-2 w-full" />
              ))}
            </p>
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-[500px] w-full rounded-xl bg-skeleton-light" />
          </div>
        </div>
      </section>
    </main>
  );
}
export function SkeletonAbout() {
  return (
    <>
      <div className="w-full">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
      <main className="w-full">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <Skeleton className="h-2 w-1/3" />
                </h2>
                <p className="mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  <Skeleton className="h-2 w-1/6" />
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tighter">
                  <Skeleton className="h-2 w-1/3" />
                </h3>
                {"abcdef".split("").map((hor, ind) => (
                  <div
                    className="mt-4 grid gap-2 text-gray-500 dark:text-gray-400"
                    key={ind}
                  >
                    <div className="flex justify-between">
                      <span>
                        <Skeleton className="h-2 w-1/3" />
                      </span>
                      <span>
                        <Skeleton className="h-2 w-1/3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                <Skeleton className="h-2 w-2/3" />
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {"ab".split("").map(
                  (comm, index) =>
                    index <= 3 && (
                      <Card key={index}>
                        <CardContent className="space-y-4  p-5">
                          <div className="space-y-2">
                            <p className="text-lg font-semibold">
                              <Skeleton className="h-3 w-1/3" />
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              <Skeleton className="h-2 w-2/3" />
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-xl" />
                            <div>
                              <div className="font-medium">
                                {" "}
                                <Skeleton className="h-3 w-1/3" />
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <Skeleton className="h-2 w-1/3" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                )}
              </div>
              <div className="flex justify-center">
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/2" />

              <div className="flex justify-center"></div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
export function SkeletonProducts() {
  return (
    <div key="1" className="container mx-auto px-6 py-8">
      {"abcdef".split("").map((cat, index) => (
        <div className="mt-12" key={index}>
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6"
            style={{
              position: "sticky",
              top: "64px",
              backgroundColor: "white",
              zIndex: 10,
            }}
          >
            <div className="grid gap-2">
              <h2 className="text-2xl font-bold">
                <Skeleton className="h-4 w-1/3" />
              </h2>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {"abc".split("").map((prod, ind) => (
                <Card className="w-full" key={ind}>
                  <Skeleton className="h-[250px] w-full rounded-xl" />

                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-lg font-bold">
                        <Skeleton className="h-4 w-1/3" />
                      </h5>
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <p className="line-clamp-2 overflow-hidden mt-1 text-gray-600">
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold">
                        <Skeleton className="h-3 w-1/3" />
                      </span>
                      <Skeleton className="h-8 w-1/3 rounded-xl" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export function SkeletonProduct() {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
        <div className="grid gap-4 md:gap-10 items-start">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
        <div className="grid gap-4 md:gap-10 items-start">
          <div className="grid gap-2">
            <div className="text-4xl font-bold">
              {" "}
              <Skeleton className="h-3 w-1/3" />
            </div>

            <div className="grid gap-2">
              <div className="grid gap-2">
                <div className="bg-gray-100 p-2 rounded-md dark:bg-gray-800">
                  <Skeleton className="h-2 w-1/3" />
                </div>

                <div className="bg-green-100 text-green-800 p-2 rounded-md dark:bg-green-900 dark:text-green-100">
                  <Skeleton className="h-2 w-2/3" />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Skeleton className="h-4 w-8 rounded-xl" />
            </div>

            <div className="grid gap-2">
              <p className="text-gray-500 dark:text-gray-400 mt-4">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-full" />
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Skeleton className="h-4 w-full rounded-xl" />
            </div>
            <Skeleton className="h-4 w-1/3 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}
