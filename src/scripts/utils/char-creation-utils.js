function _calculateStatPreview(modifier, attribute, tier, atrWeight = 1) {

    return modifier + ((attribute * atrWeight) * tier);
}

