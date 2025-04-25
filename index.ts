import dotenv from "dotenv";
import { BigNumberish, ethers } from "ethers";
import { TransactionRequest } from "ethers";

dotenv.config();

//tipagem manual
type Tx = {
  from: string;
  to: string;
  value: BigNumberish;
  gasLimit?: BigNumberish;
  nonce?: number;
  maxFeePerGas?: BigNumberish;
  maxPriorityFeePerGas?: BigNumberish;
};

//Conectando a sepholia com o alchemy provider
const provider: any = new ethers.JsonRpcProvider(
  `${process.env.API_KEY_TEST_NETWORK}`
);

console.log(provider);

async function main() {
  //Criando uma carteira através de minha private key existente
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string);

  //Conectando a wallet com o provider
  const signer = wallet.connect(provider);

  //pegando o address da carteira
  const signerAddress = await signer.getAddress();
  //Pegando o valor atual do gas
  const gasPrice = await provider.getFeeData();
  //Definindo o nonce
  const nonce = await signer.getNonce();
  //endereço destinatario
  const toAddress = "coloca o endereco aqui";

  //objeto de transacao
  const tx: TransactionRequest = {
    from: signerAddress,
    to: toAddress,
    value: ethers.parseEther("0.0001"),
    maxFeePerGas: gasPrice.maxFeePerGas!,
    maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas!,
    gasLimit: BigInt(21000),
    nonce,
  };

  //enviando transaçao pendente
  const pendingTx = await signer.sendTransaction(tx);
  console.log("pendingTx: ", pendingTx);

  //esperando a transacao ser confirmada
  const finishedTx = await pendingTx.wait();
  console.log("finishedTx: ", finishedTx);

  //pegando o balance com minha carteira conectada ao provider
  // const balance = await signer.provider.getBalance(await signer.getAddress());
}
main();
