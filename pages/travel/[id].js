import React from "react";
import Head from "next/head";
import OneTravelBody from "../../components/OneTravelComponents/OneTravelBody";
import { pageVariants, travelImage } from "../../components/GlobalComponents/Transitions";
import { motion } from "framer-motion";
import { getIDs, getOneTravel } from "../../lib/helpers/getDatas";
import { agencySchema, oneTravelSchema } from "../../lib/helpers/StructuredData";

const OneTravel = ({ travel, error }) => {
    if (error) {
        return (
            <div className="text-center text-3xl h-screen font-semibold mt-8">
                <h2>Nem található a keresett utazás</h2>
            </div>
        );
    }

    const title = `Kalandozás - ${travel?.title}`;

    return (
        <>
            <Head>
                <title>{title}</title>
                <script type="application/ld+json">
                    {JSON.stringify(
                        oneTravelSchema(
                            `https://kalandozas.hu/travel/${travel?.id}`,
                            travel?.price,
                            travel?.thumbnails?.[0] || travel?.pictures?.[0].src,
                            travel?.freePlaces !== 0 && new Date() < new Date(travel?.startingDate) && travel?.type2 !== "Jelentkezés lezárult",
                            new Date(travel?.startingDate),
                            travel?.title
                        )
                    )}
                </script>
                <script type="application/ld+json">{JSON.stringify(agencySchema())}</script>
            </Head>
            {(travel?.pictures?.length > 0 || travel?.thumbnails?.length > 0) && (
                <>
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={pageVariants}
                        className="relative shadow-xl w-full overflow-hidden"
                        style={{ height: "340px" }}
                    >
                        <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-125 bg-no-repeat"
                            style={{ backgroundImage: `url(${travel?.thumbnails?.[0] || travel?.pictures?.[0].src})`, filter: "blur(55px)" }}
                            id="blurimage"
                        />
                    </motion.div>

                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={travelImage}
                        className="px-4 absolute duration-300 hover:opacity-90 top-52 left-2/4 max-w-xl w-full"
                        style={{ transform: "translateX(-50%)" }}
                    >
                        <img
                            loading="lazy"
                            src={travel?.thumbnails?.[0] || travel?.pictures?.[0].src}
                            alt={`Utazás kép fő`}
                            className="mx-auto shadow-xl max-h-96 rounded-2xl"
                            id="topimage"
                        />
                    </motion.div>
                </>
            )}

            <motion.section initial="initial" animate="animate" variants={pageVariants}>
                <OneTravelBody travel={travel} />
            </motion.section>
        </>
    );
};

export default OneTravel;

export async function getStaticProps(context) {
    const parsedTravel = await getOneTravel(context.params.id);

    return {
        props: { travel: parsedTravel.travel || null, error: parsedTravel.error || null },
        revalidate: 300,
    };
}

export async function getStaticPaths() {
    const ids = await getIDs();
    return {
        paths: ids,
        fallback: true, // can also be true or 'blocking'
    };
}
