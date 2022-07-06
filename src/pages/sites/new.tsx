import Card from "@components/Card/Card";
import TextInput from "@components/Inputs/TextInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateSiteSchema } from "@constants/schemas";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";

type FormSchemaType = z.infer<typeof CreateSiteSchema>;

const NewSite = () => {
  const router = useRouter();
  const createSite = trpc.useMutation(["auth.createSite"]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(CreateSiteSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    createSite.mutate(data, {
      onSuccess(data, variables, context) {
        console.log("new site", data, variables, context);
        router.push(`/${data.domain}`);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label="New site form"
      className="space-y-4 w-full sm:mx-auto sm:max-w-md mt-24"
    >
      <Card>
        <h2 className="text-xl font-black text-white">Your website details</h2>

        <TextInput
          label="Domain"
          id="site-domain"
          desc="Just the naked domain or subdomain without the 'www'"
          className="w-full"
          error={errors.domain?.message || createSite.error?.message}
          {...register("domain")}
        />

        <button
          disabled={isSubmitting}
          type="submit"
          className="button w-full mt-4"
        >
          <span>Add site →</span>
        </button>
      </Card>
    </form>
  );
};

export default NewSite;
