import {
  Box,
  CircularProgress,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import AliceCarousel from "react-alice-carousel";
import { numberWithCommas } from "../../config/utils";
import { motion } from "framer-motion";
import { WarningTwoIcon } from "@chakra-ui/icons";
import Link from "next/link";

const Carousel = ({
  trendingCoins,
  isLoading,
  isError,
  windowHeight,
  currency,
  currencySymbol,
}: ICarousel) => {
  const items = trendingCoins?.map((coin: ITrendingCoin) => {
    const {
      id,
      image,
      name,
      symbol,
      price_change_percentage_24h,
      current_price,
    } = coin;
    const profit: boolean = coin.price_change_percentage_24h >= 0;

    return (
      <Link href={`/coin/${id}?c=${currency}`} passHref={true} key={coin.id}>
        <VStack border="none" justifyContent="center" cursor="pointer">
          <motion.div
            whileHover={{
              scale: 1.3,
              transition: {
                duration: 0.2,
              },
            }}
          >
            <Image
              src={image}
              alt={name}
              h={windowHeight < 860 ? "50px" : "60px"}
              my="3"
            />
          </motion.div>
          <Box display="flex" flexDirection="column" alignItems="center">
            <HStack p="0" m="0">
              <Text
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
                m="0"
                p="0"
              >
                {symbol}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="bold"
                m="0"
                p="0"
                color={profit ? "default" : "red"}
              >
                {`${profit ? "+" : ""}${price_change_percentage_24h?.toFixed(
                  2
                )}%`}
              </Text>
            </HStack>
            <HStack spacing="0">
              {currencySymbol}
              <Text fontSize="14pt" fontWeight="bold" pt="0" mt="0">
                {numberWithCommas(current_price.toFixed(2))}
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    525: {
      items: 4,
    },
  };

  if (isLoading) {
    return (
      <VStack h="55%" justifyContent="center">
        <CircularProgress isIndeterminate size="100px" color="#EEBC1D" />
      </VStack>
    );
  }

  if (isError) {
    return (
      <VStack h="55%" justifyContent="center">
        <HStack>
          <WarningTwoIcon color="#EEBC1D" boxSize={6} />
          <Text>Unable to load trending coins</Text>
        </HStack>
      </VStack>
    );
  }

  return (
    <Box h="55%" w="80%" maxW="800px" display="flex" flexDir="column">
      <AliceCarousel
        mouseTracking
        infinite
        autoPlay
        autoPlayInterval={1800}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
      />
    </Box>
  );
};

export default Carousel;
