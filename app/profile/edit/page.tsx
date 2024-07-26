"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ProfileEditPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      aboutMe: "",
      socialFacebook: "",
      socialInstagram: "",
      latitude: "",
      longitude: ""
    }
  });

  type FieldValues = ReturnType<typeof getValues>;

  const onSubmit: SubmitHandler<FieldValues> = data => {
    // setIsLoading(true);
    // axios
    //   .post("api/register", data)
    //   .then(() => {
    //     toast.success("Success!");
    //     registerModal.onClose();
    //     loginModal.onOpen();
    //   })
    //   .catch(error => {
    //     toast.error("Someting Went Wrong with registration.");
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  return (
    <main className='px-10 space-y-5'>
      <h1 className='text-3xl font-bold text-nowrap !mb-8'>
        Edit your profile
      </h1>

      <Input
        id='name'
        label='Your Name'
        disabled={isLoading}
        register={register as any}
        errors={errors}
        required
      />
      <Input
        id='aboutMe'
        label='About Me'
        disabled={isLoading}
        register={register as any}
        errors={errors}
        required
      />
      <Input
        id='socialFacebook'
        label='Facebook link'
        disabled={isLoading}
        register={register as any}
        errors={errors}
        required
      />
      <Input
        id='socialInstagram'
        label='Instagram link'
        disabled={isLoading}
        register={register as any}
        errors={errors}
        required
      />
      <div className='flex gap-x-4'>
        <Input
          id='latitude'
          label='Latitude'
          disabled={isLoading}
          register={register as any}
          errors={errors}
          required
        />
        <Input
          id='longitude'
          label='Longitude'
          disabled={isLoading}
          register={register as any}
          errors={errors}
          required
        />
      </div>

      <div className='max-w-xs'>
        <Button label='Save' />
      </div>
    </main>
  );
}
