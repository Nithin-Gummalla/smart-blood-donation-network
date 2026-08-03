package com.smartblood.dto;

import com.smartblood.model.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRequestStatusDto {

    @NotNull(message = "Status is required")
    private RequestStatus status;

    private Integer unitsFulfilled;
}
