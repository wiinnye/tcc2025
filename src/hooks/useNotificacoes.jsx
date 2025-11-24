import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, limit, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const useNotificacoes = () => {
    const [contador, setContador] = useState(0);
    const [ultimaNotificacao, setUltimaNotificacao] = useState(null);
    const [carregandoNotificacoes, setCarregandoNotificacoes] = useState(true);

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (!user || (!user.email && !user.uid)) {
            setContador(0);
            setUltimaNotificacao(null);
            setCarregandoNotificacoes(false);
            return;
        }

        const userEmail = user.email;
        const userId = user.uid;

        const qContadorRecusa = query(
            collection(db, "notificacoes_recusa"),
            where("interpreteEmail", "==", userEmail),
            where("notificacaoLida", "==", false)
        );

        const qContadorFeedback = query(
            collection(db, "feedbackAlunos"),
            where("userId", "==", userId),
            where("visto", "==", true), 
            where("notificacaoVistaPeloAluno", "==", false) 
        );

        const unsubscribes = [];


        const unsubscribeContadorRecusa = onSnapshot(qContadorRecusa, (snapshotRecusa) => {

        }, (error) => {
            console.error("Erro ao ouvir contador de recusas:", error);
        });
        unsubscribes.push(unsubscribeContadorRecusa);

        const unsubscribeContadorFeedback = onSnapshot(qContadorFeedback, async (snapshotFeedback) => {
            try {
                const snapshotRecusa = await getDocs(qContadorRecusa);
                
                const countRecusa = snapshotRecusa.docs.length;
                const countFeedback = snapshotFeedback.docs.length;
                const totalContador = countRecusa + countFeedback;
                
                setContador(totalContador);
                
                if (carregandoNotificacoes) {
                    setCarregandoNotificacoes(false);
                }

            } catch (error) {
                console.error("Erro ao calcular contador total:", error);
                setContador(0);
                setCarregandoNotificacoes(false);
            }
        }, (error) => {
            console.error("Erro ao ouvir contador de feedbacks:", error);
            setContador(0);
            setCarregandoNotificacoes(false);
        });
        unsubscribes.push(unsubscribeContadorFeedback);


        const qUltimaRecusa = query(
            collection(db, "notificacoes_recusa"),
            where("interpreteEmail", "==", userEmail),
            orderBy("dataRecusa", "desc"),
            limit(1)
        );

        const qUltimaFeedback = query(
            collection(db, "feedbackAlunos"),
            where("userId", "==", userId),
            orderBy("timestamp", "desc"),
            limit(1)
        );

        const unsubscribeUltimaRecusa = onSnapshot(qUltimaRecusa, async (snapshotRecusa) => {
            
            let ultimaRecusa = null;
            if (!snapshotRecusa.empty) {
                const data = snapshotRecusa.docs[0].data();
                ultimaRecusa = {
                    ...data,
                    id: snapshotRecusa.docs[0].id,
                    dataReferencia: data.dataRecusa,
                    tipo: 'recusa',
                    isLida: data.notificacaoLida || false
                };
            }

            const snapshotFeedback = await getDocs(qUltimaFeedback);
            let ultimoFeedback = null;
            if (!snapshotFeedback.empty) {
                const data = snapshotFeedback.docs[0].data();
                ultimoFeedback = {
                    ...data,
                    id: snapshotFeedback.docs[0].id,
                    dataReferencia: data.timestamp,
                    tipo: 'feedback',
                    isLida: data.notificacaoVistaPeloAluno || false
                };
            }

            if (ultimaRecusa && ultimoFeedback) {
                const dataRecusa = ultimaRecusa.dataReferencia?.toDate()?.getTime() || 0;
                const dataFeedback = ultimoFeedback.dataReferencia?.toDate()?.getTime() || 0;

                if (dataFeedback > dataRecusa) {
                    setUltimaNotificacao({
                        titulo: "Feedback Visualizado", 
                        isLida: ultimoFeedback.isLida
                    });
                } else {
                    setUltimaNotificacao({
                        titulo: ultimaRecusa.videoTitulo, 
                        isLida: ultimaRecusa.isLida
                    });
                }
            } else if (ultimaRecusa) {
                setUltimaNotificacao({ titulo: ultimaRecusa.videoTitulo, isLida: ultimaRecusa.isLida });
            } else if (ultimoFeedback) {
                setUltimaNotificacao({ titulo: "Feedback Visualizado", isLida: ultimoFeedback.isLida });
            } else {
                setUltimaNotificacao(null);
            }

        }, (error) => {
            console.error("Erro ao ouvir última notificação:", error);
            setUltimaNotificacao(null);
        });
        unsubscribes.push(unsubscribeUltimaRecusa);


        return () => {
            unsubscribes.forEach(unsub => unsub());
        };

    }, [user, carregandoNotificacoes]); 

    return { contador, ultimaNotificacao, carregandoNotificacoes };
};