import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, limit, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const useNotificacoesRecusa = () => {
 const [contador, setContador] = useState(0);
    const [ultimaNotificacao, setUltimaNotificacao] = useState(null);
    const [carregandoNotificacoes, setCarregandoNotificacoes] = useState(true);

       const auth = getAuth();
        const user = auth.currentUser;

    useEffect(() => {
        if (!user.email) {
            setContador(0);
            setUltimaNotificacao(null);
            setCarregandoNotificacoes(false);
            return;
        }

        const qContador = query(
            collection(db, "notificacoes_recusa"),
            where("interpreteEmail", "==", user.email),
            where("notificacaoLida", "==", false) 
        );

        const qUltima = query(
            collection(db, "notificacoes_recusa"),
            where("interpreteEmail", "==", user.email),
            orderBy("dataRecusa", "desc"), 
            limit(1) 
        );

        const unsubscribeContador = onSnapshot(qContador, (snapshot) => {
            setContador(snapshot.docs.length);
            setCarregandoNotificacoes(false);
        }, (error) => {
            console.error("Erro ao ouvir contador de notificações:", error);
            setContador(0);
            setCarregandoNotificacoes(false);
        });

        // --- LISTENER 2: ÚLTIMA NOTIFICAÇÃO (TOOLTIP) ---
        const unsubscribeUltima = onSnapshot(qUltima, (snapshot) => {
            if (!snapshot.empty) {
                setUltimaNotificacao({ 
                    ...snapshot.docs[0].data(),
                    id: snapshot.docs[0].id
                });
            } else {
                setUltimaNotificacao(null); 
            }
        }, (error) => {
            console.error("Erro ao ouvir última notificação:", error);
            setUltimaNotificacao(null);
        });


        return () => {
            unsubscribeContador();
            unsubscribeUltima();
        };

    }, [user.email]);

    return { contador, ultimaNotificacao, carregandoNotificacoes };
};