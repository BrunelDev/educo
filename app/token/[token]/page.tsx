export default async function ActivationPage(/*{
    params,
  }: {
    params: { uid: string; token: string };
  }*/) {
  //const { uid, token } = params;
  const uid = "1"
  const token = "1"
    if (uid && token) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid, token }),
        });
        if (response.ok) {
          return <div>Account successfully activated! You can now log in.</div>;
        } else {
          return (
            <div>
              Activation failed. Please check the provided link and try again.
            </div>
          );
        }
      } catch (error: unknown) {
        console.error("Error occurred during activation:", error);
        return (
          <div>An error occurred during activation. Please try again later.</div>
        );
      }
    }
  }
  