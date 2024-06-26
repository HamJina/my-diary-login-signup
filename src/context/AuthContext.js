import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useReducer } from 'react';
import { appAuth } from '../firebase/config';

// context를 객체를 생성합니다.
const AuthContext = createContext();

//reducer함수로 유저정보를 관리한다. 
const authReducer = (state, action) => {
    switch (action.type) {
        case 'login':
            //전개구문을 이용해 객체의 user 값을 업데이트 합니다.
            return { ...state, user: action.payload }
        case 'logout':
            return { ...state, user: null }
        case 'authIsReady':
            return { ...state, user: action.payload, isAuthReady: true }
        default:
            return state
    }
}


// context를 객체를 구독할 컴포넌트의 묶음 범위를 설정합니다.
const AuthContextProvider = ({ children }) => {

    //유저 정보를 관리하는 상태변화변수
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        // 사용자 인증정보가 준비되었는지 확인할 수 있는 변수
        isAuthReady: false
    })

    useEffect(() => {
        //user의 변화를 관찰하는 함수이다. 구독을 중지하기 전까지 
        const unsubscribe = onAuthStateChanged(appAuth, (user) => {
            dispatch({ type: 'authIsReady', payload: user });
        });
        return unsubscribe
    }, [])

    console.log('user state: ', state);

    return (
        // { ...state, dispatch } 이 두 가지 값이 context객체를 통해 접근할 수 있는 값이 됩니다.
        //dispatch함수를 통해서 authReducer를 호출할 수 있고 state업데이트 가능 -> 전역에서 공유 -> 회원정보가 바뀔때마다 dispatch함수를 실행시켜 user의 정보를 계속 업데이트 한다.
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider };