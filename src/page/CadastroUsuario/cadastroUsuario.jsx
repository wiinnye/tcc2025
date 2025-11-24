import {
    Button,
    Flex,
    Image,
    Input,
    Text,
    useBreakpointValue,
    Box,
} from "@chakra-ui/react";
import { useState } from "react";
import bgFuntlibra from "../../image/bgFuntlibra.png";
import { IoEyeSharp, IoEyeOff } from "react-icons/io5";
import { db } from "../../services/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"; 
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import ToolTipContainer from "../../components/ToolTip/ToolTip";
import { Notificacao } from "../../components/Notificacao/Notificacao";
import { SpinnerPage } from "../../components/Spinner/Spinner"; 

export function CadastroUsuario() {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const navigate = useNavigate();

    const [senha, setSenha] = useState("");
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [emailUsuario, setEmailUsuario] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
    const [erroSenha, setErroSenha] = useState("");
    const [erroCampos, setErroCampos] = useState("");
    const [erroEmail, setErroEmail] = useState("");
    const [erroConfirmaSenha, setConfirmaSenha] = useState("");
    const [notificacao, setNotificacao] = useState(null); 
    const [carregando, setCarregando] = useState(false); 

    const firebaseAuth = getAuth();

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        setErroSenha("");
        setConfirmaSenha("");
        setErroCampos("")
        setErroEmail("")
        
        if (!nomeUsuario || !emailUsuario || !senha || !confirmarSenha) {
            setErroCampos("Preencha todos os campos!");
            return;
        }

        if (!emailRegex.test(emailUsuario)) {
            setErroEmail("Digite um e-mail válido!");
            return;
        }

        if (senha.length < 6 || confirmarSenha.length < 6) {
            setErroSenha("A senha precisa ter no mínimo 6 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            setConfirmaSenha("As senhas não são iguais.");
            return;
        }
        
        setCarregando(true);

        const currentUser = firebaseAuth.currentUser;
        
        if (!currentUser) {
            setNotificacao({ 
                msg: "Erro: Nenhuma sessão de administrador ativa.", 
                descricao: "Faça login novamente para realizar o cadastro.",
                tipo: "erro" 
            });
            setCarregando(false);
            return;
        }
        
        let novoUsuarioUid = null;

        try {
            const userCredential = await createUserWithEmailAndPassword(
                firebaseAuth, 
                emailUsuario,
                senha
            );
            const user = userCredential.user;
            novoUsuarioUid = user.uid;

            await setDoc(doc(db, "usuarios", user.uid), {
                nome: nomeUsuario,
                email: emailUsuario,
                senha: senha,
                tipo: "aluno",
            });
            
            await firebaseAuth.updateCurrentUser(currentUser);

            setNotificacao({
                msg: "Conta de Aluno criada com sucesso!",
                tipo: "sucesso"
            });
            
            setSenha("");
            setNomeUsuario("");
            setEmailUsuario("");
            setConfirmarSenha("");
            navigate("/login");

        } catch (erro) {
            
            if (firebaseAuth.currentUser?.uid === novoUsuarioUid && currentUser) {
                 await firebaseAuth.updateCurrentUser(currentUser);
            }

            if (erro.code === "auth/email-already-in-use") {
                setNotificacao({
                    msg: "Este E-mail já está cadastrado!",
                    descricao: "Tente fazer login ou use outro E-mail",
                    tipo: "erro",
                });
            } else {
                 console.error("Erro no cadastro:", erro);
                setNotificacao({
                    msg: "Erro ao criar usuário.",
                    descricao: `Código: ${erro.code}. Verifique os dados.`,
                    tipo: "erro",
                });
            }
        } finally {
             setCarregando(false);
        }
    };

    return (
        <>
            {isMobile && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="100vw"
                    h="100vh"
                    backgroundImage={`url(${bgFuntlibra})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    zIndex={0}
                />
            )}

            <Flex
                w="100%"
                h="100vh"
                alignItems="center"
                justify="center"
                flexDirection={{ base: "column", md: "row" }}
                bg="#F3F5FC"
            >
                <Flex
                    w={{ base: "100%", lg: "50%" }}
                    h="100%"
                    alignItems={"center"}
                    flexDirection="column"
                    position="relative"
                    zIndex={1}
                >
                    <Flex w="100%" h="20%" justify="start" align="center" pl="2rem">
                        <ToolTipContainer descricao="voltar pagina">
                            <Button w="100px" bg="#579b3e" onClick={() => navigate("/login")}>
                                <RiArrowLeftLine />
                            </Button>
                        </ToolTipContainer>
                    </Flex>
                    <Flex
                        w={{ base: "300px", md: "350px", lg: "500px" }}
                        h="auto"
                        p="2rem"
                        justify="center"
                        flexDirection="column"
                        bg="#F3F5FC"
                        borderRadius="25px"
                        boxShadow="3px 2px 2px 4px #e8eaf3"
                    >
                        <Text
                            fontSize="21px"
                            mb="1rem"
                            textAlign="center"
                            color="#000"
                            fontWeight="bold"
                        >
                            Criar Conta
                        </Text>

                        <Input
                            w={{ base: "200px", md: "250px", lg: "350px" }}
                            mb="1rem"
                            placeholder="Nome Completo"
                            padding=".5rem"
                            alignSelf='center'
                            borderColor={!erroCampos ? "#DEF5DE" : "red"}
                            value={nomeUsuario}
                            onChange={(e) => setNomeUsuario(e.target.value)}
                        />
                        <Input
                            w={{ base: "200px", md: "250px", lg: "350px" }}
                            mb="1rem"
                            placeholder="Email"
                            alignSelf='center'
                            padding=".5rem"
                            borderColor={!erroEmail && !erroCampos ? "#DEF5DE" : "red"}
                            value={emailUsuario}
                            onChange={(e) => setEmailUsuario(e.target.value)}
                        />
                        {erroEmail && (
                            <Text color="red" fontSize="sm" ml="2.7rem" mb="1rem">
                                {erroEmail}
                            </Text>
                        )}

                        {/* Senha */}
                        <Box
                            position="relative"
                            w={{ base: "200px", md: "250px", lg: "350px" }}
                            mb="1rem"
                            alignSelf='center'
                        >
                            <Input
                                type={showSenha ? "text" : "password"}
                                placeholder="Senha"
                                padding=".5rem"
                                borderColor={!erroSenha && !erroCampos ? "#DEF5DE" : "red"}
                                w="100%"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                            <Box
                                position="absolute"
                                right="10px"
                                top="50%"
                                transform="translateY(-50%)"
                                cursor="pointer"
                                onClick={() => setShowSenha(!showSenha)}
                            >
                                {showSenha ? (
                                    <IoEyeOff size="1.4rem" color="#9b9191" />
                                ) : (
                                    <IoEyeSharp size="1.4rem" color="#9b9191" />
                                )}
                            </Box>
                        </Box>
                        {erroSenha && (
                            <Text color="red" fontSize="sm" ml="2.7rem" mb="1rem">
                                {erroSenha}
                            </Text>
                        )}

                        {/* Confirmar Senha */}
                        <Box
                            position="relative"
                            w={{ base: "200px", md: "250px", lg: "350px" }}
                            mb="1rem"
                            alignSelf='center'
                        >
                            <Input
                                type={showConfirmarSenha ? "text" : "password"}
                                placeholder="Confirmar Senha"
                                padding=".5rem"
                                borderColor={
                                    !erroConfirmaSenha && !erroCampos ? "#DEF5DE" : "red"
                                }
                                w="100%"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                            />
                            <Box
                                position="absolute"
                                right="10px"
                                top="50%"
                                transform="translateY(-50%)"
                                cursor="pointer"
                                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                            >
                                {showConfirmarSenha ? (
                                    <IoEyeOff size="1.4rem" color="#9b9191" />
                                ) : (
                                    <IoEyeSharp size="1.4rem" color="#9b9191" />
                                )}
                            </Box>
                        </Box>
                        {erroConfirmaSenha && (
                            <Text color="red" fontSize="sm" ml="2.7rem" mb="1rem">
                                {erroConfirmaSenha}
                            </Text>
                        )}

                        {erroCampos && (
                            <Text color="red" fontSize="sm" ml="2.7rem" mb="1rem">
                                {erroCampos}
                            </Text>
                        )}

                        {notificacao && (
                            <Notificacao
                                msg={notificacao?.msg}
                                tipo={notificacao?.tipo}
                                descricao={notificacao?.descricao}
                                onClose={() => setNotificacao(null)}
                            />
                        )}
                        
                        {carregando ? (
                             <Button
                                w={{ base: "200px", md: "250px", lg: "350px" }}
                                mb="1rem"
                                bg={"#6AB04C"}
                                color="#fff"
                                alignSelf="center"
                                isLoading
                                spinner={<SpinnerPage cor="#fff" />}
                            >
                                Criar
                            </Button>
                        ) : (
                            <Button
                                w={{ base: "200px", md: "250px", lg: "350px" }}
                                mb="1rem"
                                bg="#6AB04C"
                                alignSelf='center'
                                color="#fff"
                                _hover={{ bg: "#579b3e" }}
                                onClick={handleSubmit}
                            >
                                Criar
                            </Button>
                        )}
                    </Flex>
                </Flex>

                {!isMobile && (
                    <Flex w="50%">
                        <Image w="1000px" h="100vh" src={bgFuntlibra} />
                    </Flex>
                )}
            </Flex>
        </>
    );
}
