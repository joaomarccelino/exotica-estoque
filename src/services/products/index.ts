import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, Transaction, updateDoc, where } from "firebase/firestore";
import { firestore } from "../firebase";

export interface Size {
  size: string;
  quantity: number;
}
interface ProductFirebaseData {
  active: number;
  code: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  stock: Size[];
  sizeType: string;
}

export interface TransactionData {
  productCode: string;
  quantity: Size[];
  user: string;
  memo: string;
}

interface TransactionFirebaseData {
  id: string;
  productCode: string;
  quantity: Size[];
  user: string;
  memo: string;
}
type CadProduct = {
  product: ProductFirebaseData;
  user: string;
}

type CadTransaction = {
  newTransaction: TransactionData;
  stock: Size[]
}

export const handleAddProduct = async ({ product, user }: CadProduct) => {
  await setDoc(doc(firestore, "products", product.code), product).then(async () => {
    alert("Produto Cadastrado com sucesso!")
    const newTransaction = {
      productCode: product.code,
      user,
      quantity: product.stock,
      memo: "Cadastro do item"
    }
    const transactionRef = collection(firestore, "transactions");
    await addDoc(transactionRef, newTransaction);
  }
  );
}

export const handleGetProducts = async () => {
  const dbRef = collection(firestore, "products");
  try {
    const querySnapshot = await getDocs(dbRef);
    let productData: ProductFirebaseData[] = [];
    querySnapshot.forEach((doc) => {
      const snapData: ProductFirebaseData = {
        active: doc.data().active,
        code: doc.data().code,
        name: doc.data().name,
        category: doc.data().category,
        subcategory: doc.data().subcategory,
        description: doc.data().description,
        price: doc.data().price,
        stock: doc.data().stock,
        sizeType: doc.data().sizeType
      }
      productData.push(snapData);
    })
    return productData;
  } catch (error) {
    throw new Error();
  }
}

export const handleGetTransactions = async (code: string) => {
  const q = query(collection(firestore, "transactions"), where("productCode", "==", code))
  try {
    const querySnapshot = await getDocs(q);
    let transactionData: TransactionFirebaseData[] = [];
    querySnapshot.forEach((doc) => {
      const snapData: TransactionFirebaseData = {
        id: doc.id,
        productCode: doc.data().productCode,
        user: doc.data().user,
        memo: doc.data().memo,
        quantity: doc.data().quantity
      }
      transactionData.push(snapData);
    })
    return transactionData;
  } catch (error) {
    throw new Error();
  }
}

export const handleGetProduct = async (code: string) => {
  const docRef = doc(firestore, "products", code);
  try {
    let productData: ProductFirebaseData = {} as ProductFirebaseData;
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      productData = {
        active: data.active,
        code: data.code,
        name: data.name,
        category: data.category,
        subcategory: data.subcategory,
        description: data.description,
        price: data.price,
        stock: data.stock,
        sizeType: data.sizeType
      }
    }
    return productData;
  } catch (error) {
    throw new Error();
  }
}

export const handleAddTransaction = async ({newTransaction, stock}: CadTransaction) => {
  await addDoc(collection(firestore, "transactions"), newTransaction).then(() => {
    handleUpdateStock(newTransaction.quantity, newTransaction.productCode, stock)
    alert("Transação adicionada com sucesso!")
  });  
}

const handleUpdateStock = async (transStock: Size[], productCode: string, stock: Size[]) => {
  const productRef = doc(firestore, "products", productCode);
  const newStock = stock.map((s, index) => {
    const newSize = {
      size: s.size,
      quantity: Number(s.quantity) + Number(transStock[index].quantity)
    }
    return newSize;
  })
  await updateDoc(productRef, {
    stock: newStock
  })
}