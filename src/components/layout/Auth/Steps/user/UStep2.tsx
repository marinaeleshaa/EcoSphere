import { Step2UserSchema } from "@/frontend/schema/register.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Z from "zod";
import { useDispatch } from "react-redux";
import { saveStep2Data, setStepValid } from "@/frontend/redux/Slice/AuthSlice";
import { useEffect } from "react";

const UStep2 = () => {
  const dispatch = useDispatch();

  const form = useForm<Z.infer<typeof Step2UserSchema>>({
    resolver: zodResolver(Step2UserSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      phoneNumber: "",
      gender: "male",
    },
  });

  const onSubmit = (data: Z.infer<typeof Step2UserSchema>) => {
    dispatch(saveStep2Data(data));
  };

  useEffect(() => {
    dispatch(setStepValid({ step: 2, valid: form.formState.isValid }));
  }, [form.formState.isValid, dispatch]);

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex sm:flex gap-5 flex-col p-5">
      <form
        action=""
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <p className="text-2xl md:text-3xl font-bold text-center text-secondary-foreground">
          User Details
        </p>

        {/* First Name */}
        <div>
          <input
            type="text"
            placeholder="Enter Your First Name"
            {...register("firstName")}
            className="myInput"
          />
          {errors.firstName && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <input
            type="text"
            placeholder="Enter Your Last Name"
            {...register("lastName")}
            className="myInput"
          />
          {errors.lastName && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Birthdate */}
        <div>
          <input
            type="date"
            {...register("birthDate")}
            className="myInput"
          />
          {errors.birthDate && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <input
            type="tel"
            placeholder="Enter Your Phone Number"
            {...register("phoneNumber")}
            className="myInput"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="flex gap-5 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="female"
              {...register("gender")}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-secondary-foreground">Female</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="male"
              {...register("gender")}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-secondary-foreground">Male</span>
          </label>
        </div>

        {errors.gender && (
          <p className="text-red-500 mt-1 text-sm">{errors.gender.message}</p>
        )}
      </form>
    </div>
  );
};

export default UStep2;
