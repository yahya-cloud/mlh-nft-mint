import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex } from "@metaplex-foundation/js"
import { FC, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from "react"

export const FetchNft: FC = () => {
    const [nftData, setNftData] = useState<any>([])

  const { publicKey } = useWallet()
  const { connection } = useConnection()

  const metaplex = Metaplex.make(connection)

  const fetchNfts = async () => {
    if (!publicKey) {
      return
    }

    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: publicKey })
      .run()

    let nftData = []

    for (let i = 0; i < nfts.length; i++) {
      let fetchResult = await fetch(nfts[i].uri)
      let json = await fetchResult.json()
      nftData.push(json)
    }

    setNftData(nftData)
  }

  useEffect(() => {
    fetchNfts()
  }, [publicKey])

    return (
        <div>
        {nftData && (
            <div className={"gridNFT"}>
            {nftData.map((nft: { name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; image: string | undefined; attributes: any[] }) => (
                <div>
                <ul>{nft.name}</ul>
                <img src={nft.image} alt=""/>
                <ul>
                    {nft.attributes.map((attribute) => (
                    <li>{`${attribute.trait_type}: ${attribute.value}`}</li>
                    ))}
                </ul>
                </div>
            ))}
            </div>
        )}
        </div>
    )
}