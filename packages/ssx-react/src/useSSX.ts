import { SSX } from "@spruceid/ssx";
import * as React from 'react'
import { useMutation } from 'wagmi'

export const mutationKey = () =>
    [{ entity: 'signIn' }] as const


export function useSSX({
    ssxConfig,
    onError,
    onMutate,
    onSettled,
    onSuccess,
}: any) {
    const [ssx, setSSX] = React.useState<SSX>(new SSX(ssxConfig));

    const {
        data,
        error,
        isError,
        isIdle,
        isLoading,
        isSuccess,
        mutate: signIn,
        mutateAsync: signInAsync,
        reset,
        status,
        variables,
    } = useMutation(mutationKey(), ssx.signIn, {
        onError,
        onMutate,
        onSettled,
        onSuccess,
    });

    return {
        data,
        error,
        isError,
        isIdle,
        isLoading,
        isSuccess,
        reset,
        status,
        variables,
        signIn,
        signInAsync,
        ssx,
    }
}
