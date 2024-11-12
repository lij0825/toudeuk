import SkeletonElement from "./SkeletonElement";

const SkeletonGifticon = () => {
  return (
    <>
      <div>
        <SkeletonElement type="avatar" />
      </div>
      <div>
        <SkeletonElement type="title" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
      </div>
    </>
  );
};

export default SkeletonGifticon;
