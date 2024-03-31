import { useReducer } from "react"
import { appFireStore, timeStamp } from "../firebase/config"
import { addDoc,deleteDoc, collection, doc } from "firebase/firestore"


const initState = {
    document: null,
    isPending: false,
    error: null,
    success: false
}

// 전달 받는 action에 따른 state 업데이트를 위한 함수입니다.
const storeReducer = (state, action) => {
    switch (action.type) {
        case 'isPending':
            return { isPending: true, document: null, success: false, error: null }
        case 'addDoc':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'error':
            return { isPending: false, document: null, success: false, error: action.payload }
        case 'deleteDoc':
            return { isPending: false, document: action.payload, success: true, error: null }
        default:
            return state
    }
}


// 우리가 데이터를 저장할 컬랙션의 이름을 인자로 합니다.
export const useFirestore = (transaction) => {

    // response 에는 우리의 요청에 대한 firestore로 부터의 응답을 저장합니다.
    // 주로 데이터의 저장 성공 또는 요청한 문서 데이터일 것이며, 때문에 객체데이터를 다루는데 유용한 useReducer를 사용합니다.
    const [response, dispatch] = useReducer(storeReducer, initState);

    // colRef : 우리가 만들 컬랙션의 참조입니다.
    const colRef = collection(appFireStore, transaction);
    //appFireStore은 config.js에서 초기화했던거 


    // 컬렉션에 문서를 추가합니다.
    const addDocument = async (doc) => {
        dispatch({ type: "isPending" });
        try {
            const createdTime = timeStamp.fromDate(new Date());
            // docRef : 우리가 만들 문서의 참조입니다.
            // addDoc : 컬렉션에 문서를 추가합니다.
            // 코드참고 : https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document

            const docRef = await addDoc(colRef, { ...doc, createdTime }); //첫번째 인자는 참조할 컬렉션, 두번째 인자는 저장할 데이터
            dispatch({ type: 'addDoc', payload: docRef });
        } catch (e) {
            dispatch({ type: 'error', payload: e.message });
        }
    }

    // 컬렉션에서 문서를 제거합니다.
    const deleteDocument = async (id) => {

        dispatch({ type: "isPending" });
        try {
            const docRef = await deleteDoc(doc(colRef, id));
            dispatch({ type: 'deleteDoc', payload: docRef });
        } catch (e) {
            dispatch({ type: 'error', payload: e.message });
        }
    }

    return { addDocument, deleteDocument, response }

}