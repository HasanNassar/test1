// This is for local development only

// eslint-disable-next-line import/prefer-default-export
export const getServerSideProps = async () => {
    return {
        redirect: {
            permanent: true,
            destination: '/dubai/',
        },
    }
}

export default function Home() {
    return null
}
