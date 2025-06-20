/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/contexts/AuthContext.js":
/*!*************************************!*\
  !*** ./src/contexts/AuthContext.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nconst useAuth = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const storedToken = localStorage.getItem(\"token\");\n        const storedUser = localStorage.getItem(\"user\");\n        if (storedToken && storedUser) {\n            try {\n                const parsedUser = JSON.parse(storedUser);\n                setToken(storedToken);\n                setUser(parsedUser);\n            } catch (error) {\n                console.error(\"Error parsing stored user:\", error);\n                localStorage.removeItem(\"token\");\n                localStorage.removeItem(\"user\");\n            }\n        }\n        setLoading(false);\n    }, []);\n    const login = async (email, password)=>{\n        setLoading(true);\n        try {\n            const response = await fetch(`${\"http://localhost:5000\"}/login`, {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    email,\n                    password\n                })\n            });\n            if (!response.ok) {\n                const error = await response.json();\n                throw new Error(error.message || \"Login gagal\");\n            }\n            const data = await response.json();\n            if (!data.success) {\n                throw new Error(data.error || \"Login gagal\");\n            }\n            localStorage.setItem(\"token\", data.token);\n            localStorage.setItem(\"user\", JSON.stringify(data.user));\n            setToken(data.token);\n            setUser(data.user);\n            // Redirect berdasarkan role\n            if (data.user.role === \"admin\") {\n                router.push(\"/admin\");\n            } else {\n                router.push(\"/chat\");\n            }\n        } catch (error) {\n            console.error(\"Login error:\", error);\n            throw error;\n        } finally{\n            setLoading(false);\n        }\n    };\n    const register = async (username, email, password, role = \"user\")=>{\n        setLoading(true);\n        try {\n            const response = await fetch(`${\"http://localhost:5000\"}/register`, {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    username,\n                    email,\n                    password,\n                    role\n                })\n            });\n            if (!response.ok) {\n                const error = await response.json();\n                throw new Error(error.message || \"Registrasi gagal\");\n            }\n            const data = await response.json();\n            if (!data.success) {\n                throw new Error(data.error || \"Registrasi gagal\");\n            }\n            localStorage.setItem(\"token\", data.token);\n            localStorage.setItem(\"user\", JSON.stringify(data.user));\n            setToken(data.token);\n            setUser(data.user);\n            // Redirect berdasarkan role\n            if (data.user.role === \"admin\") {\n                router.push(\"/admin\");\n            } else {\n                router.push(\"/chat\");\n            }\n        } catch (error) {\n            console.error(\"Register error:\", error);\n            throw error;\n        } finally{\n            setLoading(false);\n        }\n    };\n    const logout = ()=>{\n        localStorage.removeItem(\"token\");\n        localStorage.removeItem(\"user\");\n        setToken(null);\n        setUser(null);\n        router.push(\"/\");\n    };\n    const fetchWithAuth = async (url, options = {})=>{\n        const token = localStorage.getItem(\"token\");\n        if (!token) {\n            console.error(\"No token found in localStorage\");\n            router.push(\"/login\");\n            throw new Error(\"Token tidak ditemukan\");\n        }\n        console.log(\"Making authenticated request to:\", url);\n        console.log(\"Request method:\", options.method || \"GET\");\n        console.log(\"Request body:\", options.body ? \"Present\" : \"Not present\");\n        // Buat headers baru dengan tetap mempertahankan Content-Type dari options.headers jika ada\n        const existingContentType = options.headers && options.headers[\"Content-Type\"];\n        const headers = {\n            \"Content-Type\": existingContentType || \"application/json\",\n            \"Authorization\": `Bearer ${token}`,\n            ...options.headers || {}\n        };\n        // Jangan tumpuk header Content-Type\n        if (existingContentType) {\n            delete options.headers?.[\"Content-Type\"];\n        }\n        try {\n            console.log(\"Sending request with headers:\", JSON.stringify(headers));\n            // Log request body jika ada\n            if (options.body) {\n                try {\n                    console.log(\"Request body:\", typeof options.body === \"string\" ? options.body : JSON.stringify(options.body));\n                } catch (e) {\n                    console.log(\"Request body (not stringifiable):\", options.body);\n                }\n            }\n            const response = await fetch(url, {\n                ...options,\n                headers,\n                credentials: \"include\",\n                mode: \"cors\"\n            });\n            console.log(\"Response status:\", response.status);\n            console.log(\"Response status text:\", response.statusText);\n            // Try to peek at response body for debugging without consuming it\n            const responseClone = response.clone();\n            try {\n                const responseBody = await responseClone.text();\n                console.log(\"Response body preview:\", responseBody.substring(0, 150) + (responseBody.length > 150 ? \"...\" : \"\"));\n            } catch (bodyError) {\n                console.log(\"Could not preview response body:\", bodyError.message);\n            }\n            if (response.status === 401) {\n                console.error(\"Authentication failed: 401 Unauthorized\");\n                logout();\n                throw new Error(\"Sesi berakhir. Silakan login kembali.\");\n            }\n            return response;\n        } catch (error) {\n            console.error(\"Network error in fetchWithAuth:\", error.message);\n            console.error(\"Error stack:\", error.stack);\n            throw error;\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            token,\n            login,\n            register,\n            logout,\n            fetchWithAuth,\n            loading,\n            isAuthenticated: !!token,\n            isAdmin: user?.is_admin || user?.role === \"admin\"\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\xampp\\\\htdocs\\\\CHATBOT new\\\\CHATBOT\\\\frontend\\\\src\\\\contexts\\\\AuthContext.js\",\n        lineNumber: 192,\n        columnNumber: 5\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AuthContext);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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STtnQkFDRixNQUFNQyxlQUFlLE1BQU1GLGNBQWNHLElBQUk7Z0JBQzdDdkMsUUFBUTZCLEdBQUcsQ0FBQywwQkFBMEJTLGFBQWFFLFNBQVMsQ0FBQyxHQUFHLE9BQVFGLENBQUFBLGFBQWFHLE1BQU0sR0FBRyxNQUFNLFFBQVEsRUFBQztZQUMvRyxFQUFFLE9BQU9DLFdBQVc7Z0JBQ2xCMUMsUUFBUTZCLEdBQUcsQ0FBQyxvQ0FBb0NhLFVBQVV6QixPQUFPO1lBQ25FO1lBRUEsSUFBSVosU0FBUzZCLE1BQU0sS0FBSyxLQUFLO2dCQUMzQmxDLFFBQVFELEtBQUssQ0FBQztnQkFDZDBCO2dCQUNBLE1BQU0sSUFBSVQsTUFBTTtZQUNsQjtZQUVBLE9BQU9YO1FBQ1QsRUFBRSxPQUFPTixPQUFPO1lBQ2RDLFFBQVFELEtBQUssQ0FBQyxtQ0FBbUNBLE1BQU1rQixPQUFPO1lBQzlEakIsUUFBUUQsS0FBSyxDQUFDLGdCQUFnQkEsTUFBTTRDLEtBQUs7WUFDekMsTUFBTTVDO1FBQ1I7SUFDRjtJQUVBLHFCQUNFLDhEQUFDbEIsWUFBWStELFFBQVE7UUFBQ0MsT0FBTztZQUMzQjVEO1lBQ0FFO1lBQ0FlO1lBQ0FxQjtZQUNBRTtZQUNBQztZQUNBckM7WUFDQXlELGlCQUFpQixDQUFDLENBQUMzRDtZQUNuQjRELFNBQVM5RCxNQUFNK0QsWUFBWS9ELE1BQU1vQyxTQUFTO1FBQzVDO2tCQUNHckM7Ozs7OztBQUdQLEVBQUU7QUFFRixpRUFBZUgsV0FBV0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Zyb250ZW5kLy4vc3JjL2NvbnRleHRzL0F1dGhDb250ZXh0LmpzPzc4NzYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuXHJcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZUF1dGggPSAoKSA9PiB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcclxuXHJcbmV4cG9ydCBjb25zdCBBdXRoUHJvdmlkZXIgPSAoeyBjaGlsZHJlbiB9KSA9PiB7XHJcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IHN0b3JlZFRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcbiAgICBjb25zdCBzdG9yZWRVc2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKTtcclxuICAgIFxyXG4gICAgaWYgKHN0b3JlZFRva2VuICYmIHN0b3JlZFVzZXIpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBwYXJzZWRVc2VyID0gSlNPTi5wYXJzZShzdG9yZWRVc2VyKTtcclxuICAgICAgICBzZXRUb2tlbihzdG9yZWRUb2tlbik7XHJcbiAgICAgICAgc2V0VXNlcihwYXJzZWRVc2VyKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwYXJzaW5nIHN0b3JlZCB1c2VyOicsIGVycm9yKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW4nKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlcicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IGxvZ2luID0gYXN5bmMgKGVtYWlsLCBwYXNzd29yZCkgPT4ge1xyXG4gICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTH0vbG9naW5gLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCwgcGFzc3dvcmQgfSlcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0xvZ2luIGdhZ2FsJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoIWRhdGEuc3VjY2Vzcykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLmVycm9yIHx8ICdMb2dpbiBnYWdhbCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCBkYXRhLnRva2VuKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCBKU09OLnN0cmluZ2lmeShkYXRhLnVzZXIpKTtcclxuICAgICAgXHJcbiAgICAgIHNldFRva2VuKGRhdGEudG9rZW4pO1xyXG4gICAgICBzZXRVc2VyKGRhdGEudXNlcik7XHJcbiAgICAgIFxyXG4gICAgICAvLyBSZWRpcmVjdCBiZXJkYXNhcmthbiByb2xlXHJcbiAgICAgIGlmIChkYXRhLnVzZXIucm9sZSA9PT0gJ2FkbWluJykge1xyXG4gICAgICAgIHJvdXRlci5wdXNoKCcvYWRtaW4nKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByb3V0ZXIucHVzaCgnL2NoYXQnKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignTG9naW4gZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlZ2lzdGVyID0gYXN5bmMgKHVzZXJuYW1lLCBlbWFpbCwgcGFzc3dvcmQsIHJvbGUgPSAndXNlcicpID0+IHtcclxuICAgIHNldExvYWRpbmcodHJ1ZSk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3Byb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQSV9VUkx9L3JlZ2lzdGVyYCwge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIGVtYWlsLCBwYXNzd29yZCwgcm9sZSB9KVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnUmVnaXN0cmFzaSBnYWdhbCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBcclxuICAgICAgaWYgKCFkYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5lcnJvciB8fCAnUmVnaXN0cmFzaSBnYWdhbCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCBkYXRhLnRva2VuKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCBKU09OLnN0cmluZ2lmeShkYXRhLnVzZXIpKTtcclxuICAgICAgXHJcbiAgICAgIHNldFRva2VuKGRhdGEudG9rZW4pO1xyXG4gICAgICBzZXRVc2VyKGRhdGEudXNlcik7XHJcbiAgICAgIFxyXG4gICAgICAvLyBSZWRpcmVjdCBiZXJkYXNhcmthbiByb2xlXHJcbiAgICAgIGlmIChkYXRhLnVzZXIucm9sZSA9PT0gJ2FkbWluJykge1xyXG4gICAgICAgIHJvdXRlci5wdXNoKCcvYWRtaW4nKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByb3V0ZXIucHVzaCgnL2NoYXQnKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignUmVnaXN0ZXIgZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGxvZ291dCA9ICgpID0+IHtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbicpO1xyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKTtcclxuICAgIHNldFRva2VuKG51bGwpO1xyXG4gICAgc2V0VXNlcihudWxsKTtcclxuICAgIHJvdXRlci5wdXNoKCcvJyk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZmV0Y2hXaXRoQXV0aCA9IGFzeW5jICh1cmwsIG9wdGlvbnMgPSB7fSkgPT4ge1xyXG4gICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcclxuICAgIGlmICghdG9rZW4pIHtcclxuICAgICAgY29uc29sZS5lcnJvcignTm8gdG9rZW4gZm91bmQgaW4gbG9jYWxTdG9yYWdlJyk7XHJcbiAgICAgIHJvdXRlci5wdXNoKCcvbG9naW4nKTtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUb2tlbiB0aWRhayBkaXRlbXVrYW4nKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnTWFraW5nIGF1dGhlbnRpY2F0ZWQgcmVxdWVzdCB0bzonLCB1cmwpO1xyXG4gICAgY29uc29sZS5sb2coJ1JlcXVlc3QgbWV0aG9kOicsIG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnKTtcclxuICAgIGNvbnNvbGUubG9nKCdSZXF1ZXN0IGJvZHk6Jywgb3B0aW9ucy5ib2R5ID8gJ1ByZXNlbnQnIDogJ05vdCBwcmVzZW50Jyk7XHJcblxyXG4gICAgLy8gQnVhdCBoZWFkZXJzIGJhcnUgZGVuZ2FuIHRldGFwIG1lbXBlcnRhaGFua2FuIENvbnRlbnQtVHlwZSBkYXJpIG9wdGlvbnMuaGVhZGVycyBqaWthIGFkYVxyXG4gICAgY29uc3QgZXhpc3RpbmdDb250ZW50VHlwZSA9IG9wdGlvbnMuaGVhZGVycyAmJiBvcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddO1xyXG4gICAgXHJcbiAgICBjb25zdCBoZWFkZXJzID0ge1xyXG4gICAgICAnQ29udGVudC1UeXBlJzogZXhpc3RpbmdDb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Rva2VufWAsXHJcbiAgICAgIC4uLihvcHRpb25zLmhlYWRlcnMgfHwge30pXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvLyBKYW5nYW4gdHVtcHVrIGhlYWRlciBDb250ZW50LVR5cGVcclxuICAgIGlmIChleGlzdGluZ0NvbnRlbnRUeXBlKSB7XHJcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmhlYWRlcnM/LlsnQ29udGVudC1UeXBlJ107XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc29sZS5sb2coJ1NlbmRpbmcgcmVxdWVzdCB3aXRoIGhlYWRlcnM6JywgSlNPTi5zdHJpbmdpZnkoaGVhZGVycykpO1xyXG4gICAgICBcclxuICAgICAgLy8gTG9nIHJlcXVlc3QgYm9keSBqaWthIGFkYVxyXG4gICAgICBpZiAob3B0aW9ucy5ib2R5KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXF1ZXN0IGJvZHk6JywgdHlwZW9mIG9wdGlvbnMuYm9keSA9PT0gJ3N0cmluZycgPyBvcHRpb25zLmJvZHkgOiBKU09OLnN0cmluZ2lmeShvcHRpb25zLmJvZHkpKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUmVxdWVzdCBib2R5IChub3Qgc3RyaW5naWZpYWJsZSk6Jywgb3B0aW9ucy5ib2R5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgICBoZWFkZXJzLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc29sZS5sb2coJ1Jlc3BvbnNlIHN0YXR1czonLCByZXNwb25zZS5zdGF0dXMpO1xyXG4gICAgICBjb25zb2xlLmxvZygnUmVzcG9uc2Ugc3RhdHVzIHRleHQ6JywgcmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBUcnkgdG8gcGVlayBhdCByZXNwb25zZSBib2R5IGZvciBkZWJ1Z2dpbmcgd2l0aG91dCBjb25zdW1pbmcgaXRcclxuICAgICAgY29uc3QgcmVzcG9uc2VDbG9uZSA9IHJlc3BvbnNlLmNsb25lKCk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VCb2R5ID0gYXdhaXQgcmVzcG9uc2VDbG9uZS50ZXh0KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1Jlc3BvbnNlIGJvZHkgcHJldmlldzonLCByZXNwb25zZUJvZHkuc3Vic3RyaW5nKDAsIDE1MCkgKyAocmVzcG9uc2VCb2R5Lmxlbmd0aCA+IDE1MCA/ICcuLi4nIDogJycpKTtcclxuICAgICAgfSBjYXRjaCAoYm9keUVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBwcmV2aWV3IHJlc3BvbnNlIGJvZHk6JywgYm9keUVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdBdXRoZW50aWNhdGlvbiBmYWlsZWQ6IDQwMSBVbmF1dGhvcml6ZWQnKTtcclxuICAgICAgICBsb2dvdXQoKTtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Nlc2kgYmVyYWtoaXIuIFNpbGFrYW4gbG9naW4ga2VtYmFsaS4nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignTmV0d29yayBlcnJvciBpbiBmZXRjaFdpdGhBdXRoOicsIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzdGFjazonLCBlcnJvci5zdGFjayk7XHJcbiAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgXHJcbiAgICAgIHVzZXIsXHJcbiAgICAgIHRva2VuLFxyXG4gICAgICBsb2dpbixcclxuICAgICAgcmVnaXN0ZXIsXHJcbiAgICAgIGxvZ291dCxcclxuICAgICAgZmV0Y2hXaXRoQXV0aCxcclxuICAgICAgbG9hZGluZyxcclxuICAgICAgaXNBdXRoZW50aWNhdGVkOiAhIXRva2VuLFxyXG4gICAgICBpc0FkbWluOiB1c2VyPy5pc19hZG1pbiB8fCB1c2VyPy5yb2xlID09PSAnYWRtaW4nXHJcbiAgICB9fT5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXV0aENvbnRleHQ7Il0sIm5hbWVzIjpbIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInVzZVJvdXRlciIsIkF1dGhDb250ZXh0IiwidXNlQXV0aCIsIkF1dGhQcm92aWRlciIsImNoaWxkcmVuIiwidXNlciIsInNldFVzZXIiLCJ0b2tlbiIsInNldFRva2VuIiwibG9hZGluZyIsInNldExvYWRpbmciLCJyb3V0ZXIiLCJzdG9yZWRUb2tlbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzdG9yZWRVc2VyIiwicGFyc2VkVXNlciIsIkpTT04iLCJwYXJzZSIsImVycm9yIiwiY29uc29sZSIsInJlbW92ZUl0ZW0iLCJsb2dpbiIsImVtYWlsIiwicGFzc3dvcmQiLCJyZXNwb25zZSIsImZldGNoIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX0FQSV9VUkwiLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsInN0cmluZ2lmeSIsIm9rIiwianNvbiIsIkVycm9yIiwibWVzc2FnZSIsImRhdGEiLCJzdWNjZXNzIiwic2V0SXRlbSIsInJvbGUiLCJwdXNoIiwicmVnaXN0ZXIiLCJ1c2VybmFtZSIsImxvZ291dCIsImZldGNoV2l0aEF1dGgiLCJ1cmwiLCJvcHRpb25zIiwibG9nIiwiZXhpc3RpbmdDb250ZW50VHlwZSIsImUiLCJjcmVkZW50aWFscyIsIm1vZGUiLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwicmVzcG9uc2VDbG9uZSIsImNsb25lIiwicmVzcG9uc2VCb2R5IiwidGV4dCIsInN1YnN0cmluZyIsImxlbmd0aCIsImJvZHlFcnJvciIsInN0YWNrIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsImlzQXV0aGVudGljYXRlZCIsImlzQWRtaW4iLCJpc19hZG1pbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/contexts/AuthContext.js\n");

/***/ }),

/***/ "./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mui/material/styles */ \"@mui/material/styles\");\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _mui_material_CssBaseline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/CssBaseline */ \"@mui/material/CssBaseline\");\n/* harmony import */ var _mui_material_CssBaseline__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_mui_material_CssBaseline__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./src/contexts/AuthContext.js\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _styles_style_chat_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/style-chat.css */ \"./src/styles/style-chat.css\");\n/* harmony import */ var _styles_style_chat_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_styles_style_chat_css__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nconst theme = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__.createTheme)();\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__.ThemeProvider, {\n        theme: theme,\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_mui_material_CssBaseline__WEBPACK_IMPORTED_MODULE_2___default()), {}, void 0, false, {\n                fileName: \"C:\\\\xampp\\\\htdocs\\\\CHATBOT new\\\\CHATBOT\\\\frontend\\\\src\\\\pages\\\\_app.js\",\n                lineNumber: 12,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__.AuthProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"C:\\\\xampp\\\\htdocs\\\\CHATBOT new\\\\CHATBOT\\\\frontend\\\\src\\\\pages\\\\_app.js\",\n                    lineNumber: 14,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\xampp\\\\htdocs\\\\CHATBOT new\\\\CHATBOT\\\\frontend\\\\src\\\\pages\\\\_app.js\",\n                lineNumber: 13,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\xampp\\\\htdocs\\\\CHATBOT new\\\\CHATBOT\\\\frontend\\\\src\\\\pages\\\\_app.js\",\n        lineNumber: 11,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQWtFO0FBQ2Q7QUFDRztBQUN4QjtBQUNHO0FBRWxDLE1BQU1JLFFBQVFILGlFQUFXQTtBQUVWLFNBQVNJLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDbEQscUJBQ0UsOERBQUNQLCtEQUFhQTtRQUFDSSxPQUFPQTs7MEJBQ3BCLDhEQUFDRixrRUFBV0E7Ozs7OzBCQUNaLDhEQUFDQywrREFBWUE7MEJBQ1gsNEVBQUNHO29CQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSWhDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnJvbnRlbmQvLi9zcmMvcGFnZXMvX2FwcC5qcz84ZmRhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRoZW1lUHJvdmlkZXIsIGNyZWF0ZVRoZW1lIH0gZnJvbSAnQG11aS9tYXRlcmlhbC9zdHlsZXMnO1xyXG5pbXBvcnQgQ3NzQmFzZWxpbmUgZnJvbSAnQG11aS9tYXRlcmlhbC9Dc3NCYXNlbGluZSc7XHJcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2NvbnRleHRzL0F1dGhDb250ZXh0JztcclxuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xyXG5pbXBvcnQgJy4uL3N0eWxlcy9zdHlsZS1jaGF0LmNzcyc7XHJcblxyXG5jb25zdCB0aGVtZSA9IGNyZWF0ZVRoZW1lKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXt0aGVtZX0+XHJcbiAgICAgIDxDc3NCYXNlbGluZSAvPlxyXG4gICAgICA8QXV0aFByb3ZpZGVyPlxyXG4gICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgICAgPC9BdXRoUHJvdmlkZXI+XHJcbiAgICA8L1RoZW1lUHJvdmlkZXI+XHJcbiAgKTtcclxufSJdLCJuYW1lcyI6WyJUaGVtZVByb3ZpZGVyIiwiY3JlYXRlVGhlbWUiLCJDc3NCYXNlbGluZSIsIkF1dGhQcm92aWRlciIsInRoZW1lIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.js\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/style-chat.css":
/*!***********************************!*\
  !*** ./src/styles/style-chat.css ***!
  \***********************************/
/***/ (() => {



/***/ }),

/***/ "@mui/material/CssBaseline":
/*!********************************************!*\
  !*** external "@mui/material/CssBaseline" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/material/CssBaseline");

/***/ }),

/***/ "@mui/material/styles":
/*!***************************************!*\
  !*** external "@mui/material/styles" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/material/styles");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./src/pages/_app.js")));
module.exports = __webpack_exports__;

})();